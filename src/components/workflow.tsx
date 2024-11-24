'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
	Node,
	Edge,
	Connection,
	addEdge,
	Background,
	Controls,
	NodeChange,
	EdgeChange,
	applyNodeChanges,
	applyEdgeChanges,
	// NodeProps,
	// Handle,
	// Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Step, Workflow } from '@/interfaces/workflow.dto';
import { CustomNode } from './workflowNode';

const nodeTypes = {
	custom: CustomNode,
};

export default function WorkflowBuilder() {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [currentWorkflowName, setCurrentWorkflowName] = useState('');
	const [currentWorkflowId, setCurrentWorkflowId] = useState('');

	const handleStepChange = useCallback(
		(
			id: string,
			field: 'prompt' | 'options' | 'title' | 'promptPlaceholder',
			value: string | string[]
		) => {
			setNodes((nds) =>
				nds.map((node) =>
					node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
				)
			);
		},
		[]
	);

	const deleteNode = useCallback((id: string) => {
		setNodes((nds) => nds.filter((node) => node.id !== id));
		setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
	}, []);

	const initializeNodes = useCallback(() => {
		const initialNodes: Node[] = [
			{
				id: 'start',
				type: 'custom',
				data: {
					id: 'start',
					type: 'start',
					title: '',
					prompt: '',
					options: [],
					onChange: handleStepChange,
					onDelete: deleteNode,
				},
				position: { x: 40, y: 20 },
			},
			{
				id: 'end',
				type: 'custom',
				data: {
					id: 'end',
					type: 'end',
					title: 'END',
					options: [],
					onChange: handleStepChange,
					onDelete: deleteNode,
				},
				position: { x: 1000, y: 20 },
			},
		];
		setNodes(initialNodes);
	}, [handleStepChange, deleteNode]);

	useEffect(() => {
		initializeNodes();
		const savedWorkflows = localStorage.getItem('workflows');
		if (savedWorkflows) {
			setWorkflows(JSON.parse(savedWorkflows));
		}
	}, [initializeNodes]);

	const addStep = useCallback(() => {
		const newNode: Node<Step> = {
			id: `step-${nodes.length + 1}`,
			type: 'custom',
			data: {
				id: `step-${nodes.length + 1}`,
				type: 'custom',
				title: '',
				prompt: '',
				options: '',
				onChange: handleStepChange,
				onDelete: deleteNode,
			},
			position: { x: Math.random() * 500, y: Math.random() * 300 + 150 },
		};
		setNodes((nds) => [...nds, newNode]);
	}, [nodes.length, handleStepChange, deleteNode]);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[]
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[]
	);

	const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), []);

	const saveWorkflow = useCallback(() => {
		if (nodes?.[0]?.data?.title?.trim() === '') {
			alert('Please enter a workflow name in the first step');
			return;
		}
		// if workflow id already exists then update it
		const existingWorkflowIndex = workflows.findIndex((w) => w.id === currentWorkflowId);
		console.log({ existingWorkflowIndex });
		let updatedWorkflows: Workflow[] = [];
		if (existingWorkflowIndex !== -1) {
			// update the workflow
			updatedWorkflows = [...workflows];
			updatedWorkflows[existingWorkflowIndex] = {
				id: currentWorkflowId,
				name: nodes?.[0]?.data?.title?.trim(),
				nodes,
				edges,
			};
		} else {
			const newWorkflow: Workflow = {
				id: Date.now().toString(),
				name: nodes?.[0]?.data?.title?.trim(),
				nodes,
				edges,
			};
			updatedWorkflows = [...workflows, newWorkflow];
		}
		setWorkflows(updatedWorkflows);
		localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
	}, [currentWorkflowName, nodes, edges, workflows]);

	const deleteWorkflow = useCallback(
		(workflowId: string) => {
			const updatedWorkflows = workflows.filter((w) => w.id !== workflowId);
			setWorkflows(updatedWorkflows);
			localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
			if (updatedWorkflows.length === 0) {
				resetWorkflow();
			} else {
				setCurrentWorkflowName(updatedWorkflows[0]?.name);
				setCurrentWorkflowId(updatedWorkflows[0]?.id);
				loadWorkflow(updatedWorkflows[0].id);
			}
		},
		[workflows]
	);

	const resetWorkflow = useCallback(() => {
		initializeNodes();
		setEdges([]);
		setCurrentWorkflowId('');
		setCurrentWorkflowName('');
	}, []);

	const loadWorkflow = useCallback(
		(workflowId: string) => {
			const workflow = workflows.find((w) => w.id === workflowId);
			if (workflow) {
				setNodes(
					workflow.nodes.map((node) => ({
						...node,
						data: {
							...node.data,
							onChange: handleStepChange,
							onDelete: deleteNode,
						},
					}))
				);
				setEdges(workflow.edges);
				setCurrentWorkflowName(workflow.name);
				setCurrentWorkflowId(workflow.id);
			}
		},
		[workflows, handleStepChange, deleteNode]
	);

	return (
		<div className="h-[92vh] flex flex-col">
			<div className="p-4 border-b">
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<h2 className="text-xl font-semibold">Workflow Builder</h2>
						<Button
							className="border border-primary mr-4"
							variant={'outline'}
							size={'sm'}
							onClick={() => resetWorkflow()}
						>
							New
						</Button>
						<Button size={'sm'} onClick={addStep}>
							+ Add Step
						</Button>
						<Button onClick={saveWorkflow} size={'sm'}>
							Save
						</Button>
					</div>
					{/* <p className="text-sm font-semibold">Workflow {currentWorkflowName}</p> */}
					<div className="flex items-center gap-2">
						<p className="text-xs font-semibold">Load a workflow</p>
						<Select value={currentWorkflowId} onValueChange={loadWorkflow}>
							<SelectTrigger className="w-64">
								<SelectValue placeholder="Select a workflow" />
							</SelectTrigger>
							<SelectContent>
								{workflows.map((workflow) => (
									<SelectItem key={workflow.id} value={workflow.id}>
										{workflow.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							className="border border-primary"
							variant={'outline'}
							size={'sm'}
							onClick={() => deleteWorkflow(currentWorkflowId)}
						>
							Delete
						</Button>
					</div>
				</div>
			</div>
			<div className="flex-grow">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					snapToGrid
					snapGrid={[20, 20]}
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</div>
	);
}
