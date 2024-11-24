'use client';

// import React, { useState, useCallback, useEffect } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Step, stepFunctionalities } from '@/interfaces/workflow.dto';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const CustomNode = ({ data }: NodeProps<Step>) => {
	return (
		<Card
			className={cn(
				`w-64`,
				data.type === 'start'
					? 'bg-green-100  w-40'
					: data.type === 'end'
					? 'bg-red-100 w-40 h-28'
					: ''
			)}
		>
			{data.type !== 'start' && <Handle type="target" position={Position.Left} />}
			{data.type !== 'end' && <Handle type="source" position={Position.Right} />}

			<CardContent className="p-4 space-y-5">
				<div className="flex justify-between items-center mb-2">
					<span className="font-semibold text-xs">
						{data.type === 'start' ? 'Start' : data.title}
					</span>
					{data.type !== 'start' && data.type !== 'end' && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => data.onDelete(data.id)}
						>
							<Trash2 className="h-4 w-4 text-red-500" />
						</Button>
					)}
				</div>

				{data.type !== 'end' && data.type !== 'start' && (
					<div className="space-y-3">
						<Label
							htmlFor={`select-${data.id}`}
							className="mb-1 text-slate-500 block text-xs"
							required
						>
							Select an operation
						</Label>
						<Select
							required
							value={data.options}
							onValueChange={(value) => {
								data.onChange(data.id, 'options', value);
								const placeholder = stepFunctionalities.find(
									(f) => f.value === value
								)?.placeholder;
								data.onChange(
									data.id,
									'promptPlaceholder',
									placeholder ?? ''
								);
							}}
						>
							<SelectTrigger id={`select-${data.id}`}>
								<SelectValue placeholder="Select options" />
							</SelectTrigger>
							<SelectContent>
								{stepFunctionalities.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{data.promptPlaceholder && (
							<Textarea
								value={data.prompt}
								onChange={(e) =>
									data.onChange(data.id, 'prompt', e.target.value)
								}
								className="mt-2 h-24 resize-none"
								placeholder={data.promptPlaceholder}
							/>
						)}
						<Input
							type="text"
							id={`title-${data.id}`}
							value={data.title}
							onChange={(e) => data.onChange(data.id, 'title', e.target.value)}
							className="mt-2"
							placeholder="Enter step name"
						/>
					</div>
				)}

				{data.type === 'start' && (
					<Textarea
						value={data.title}
						onChange={(e) => data.onChange(data.id, 'title', e.target.value)}
						className="mt-2 h-20"
						placeholder="Enter workflow name"
					/>
				)}
				{data.type === 'end' && <p className="text-sm text-slate-500">Output in sidepanel</p>}
			</CardContent>
		</Card>
	);
};
