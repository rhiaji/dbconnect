import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useApp } from '@/context/AppContext'

const fieldTypes = ['String', 'Number', 'Date', 'Boolean', 'Array', 'Object', 'Null']

const CreateCollectionModal = ({ isOpen, onClose }) => {
	const { createCollectionHandler, db } = useApp()
	const [collectionName, setCollectionName] = useState('')
	const [schema, setSchema] = useState([{ key: '', value: 'String', unique: false }])

	const handleSchemaChange = (index, field, value) => {
		const newSchema = [...schema]
		newSchema[index][field] = value
		setSchema(newSchema)
	}

	const addSchemaField = () => {
		setSchema([...schema, { key: '', value: 'String', unique: false }])
	}

	const removeSchemaField = (index) => {
		const newSchema = schema.filter((_, i) => i !== index)
		setSchema(newSchema)
	}

	const handleCreate = () => {
		if (collectionName.trim()) {
			// Convert the schema array into an object
			const validSchema = schema.filter((field) => field.key.trim() !== '' && field.value.trim() !== '')

			// Transform the schema array into an object
			const schemaObject = validSchema.reduce((acc, field) => {
				acc[field.key] = { type: field.value, unique: field.unique }
				return acc
			}, {})

			// Now pass the schemaObject to the createCollectionHandler
			createCollectionHandler(db, collectionName.trim(), schemaObject)

			setCollectionName('')
			setSchema([{ key: '', value: 'String', unique: false }])
			onClose()
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create New Collection</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Collection Name</label>
						<Input
							type="text"
							value={collectionName}
							onChange={(e) => setCollectionName(e.target.value)}
							placeholder="Enter collection name"
							autoFocus
						/>
					</div>

					<div className="space-y-3">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Collection Schema (optional)</label>
						<div className="space-y-2 max-h-48 overflow-y-auto pr-2">
							{schema.map((field, index) => (
								<div key={index} className="flex items-center gap-2">
									<Input
										type="text"
										value={field.key}
										onChange={(e) => handleSchemaChange(index, 'key', e.target.value)}
										placeholder="Field Name"
									/>
									<Select value={field.value} onValueChange={(value) => handleSchemaChange(index, 'value', value)}>
										<SelectTrigger>
											<SelectValue placeholder="Field Type" />
										</SelectTrigger>
										<SelectContent>
											{fieldTypes.map((type) => (
												<SelectItem key={type} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<div className="flex items-center space-x-2">
										<Switch
											id={`unique-${index}`}
											checked={field.unique}
											onCheckedChange={(checked) => handleSchemaChange(index, 'unique', checked)}
										/>
										<label htmlFor={`unique-${index}`} className="text-sm font-medium leading-none">
											Unique
										</label>
									</div>
									<Button onClick={() => removeSchemaField(index)} variant="ghost" size="icon" disabled={schema.length <= 1}>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
						<Button onClick={addSchemaField} variant="outline" size="sm">
							<Plus className="w-4 h-4 mr-2" />
							Add Field
						</Button>
					</div>

					<div className="flex gap-3 justify-end">
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={handleCreate} disabled={!collectionName.trim() || schema.length === 0}>
							<Plus className="w-4 h-4 mr-2" />
							Create Collection
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default CreateCollectionModal
