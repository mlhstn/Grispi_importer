export type ImportType = 'User' | 'Organization' | 'Group' | 'Ticket' | 'CustomField';

export interface ExcelData {
  headers: string[];
  rows: string[][];
  sheetName: string;
}

export interface MappingField {
  excelColumn: string;
  grispiField: string;
}

export interface MappingResult {
  importType: ImportType;
  mappings: MappingField[];
  totalRows: number;
  mappedFields: number;
}

export interface GrispiField {
  value: string;
  label: string;
}

export const GRISPI_FIELDS: Record<ImportType, GrispiField[]> = {
  User: [
    { value: 'externalId', label: 'External ID' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'phone', label: 'Phone' },
    { value: 'emails', label: 'Emails' },
    { value: 'tags', label: 'Tags' },
    { value: 'role', label: 'Role' },
    { value: 'language', label: 'Language' },
    { value: 'organization', label: 'Organization' },
    { value: 'groups', label: 'Groups' },
    { value: 'enabled', label: 'Enabled' }
  ],
  Organization: [
    { value: 'externalId', label: 'External ID' },
    { value: 'name', label: 'Organization Name' },
    { value: 'description', label: 'Description' },
    { value: 'details', label: 'Details' },
    { value: 'notes', label: 'Notes' },
    { value: 'group', label: 'Group' },
    { value: 'domains', label: 'Domains' },
    { value: 'tags', label: 'Tags' }
  ],
  Group: [
    { value: 'name', label: 'Group Name' }
  ],
  Ticket: [
    { value: 'externalId', label: 'External ID' },
    { value: 'subject', label: 'Subject' },
    { value: 'description', label: 'Description' },
    { value: 'creator', label: 'Creator' },
    { value: 'requester', label: 'Requester' },
    { value: 'assignee', label: 'Assignee' },
    { value: 'assigneeGroup', label: 'Assignee Group' },
    { value: 'organization', label: 'Organization' },
    { value: 'status', label: 'Status' },
    { value: 'channel', label: 'Channel' },
    { value: 'type', label: 'Type' },
    { value: 'priority', label: 'Priority' },
    { value: 'form', label: 'Form' },
    { value: 'createdAt', label: 'Created At' },
    { value: 'updatedAt', label: 'Updated At' },
    { value: 'solvedAt', label: 'Solved At' },
    { value: 'tags', label: 'Tags' }
  ],
  CustomField: [
    { value: 'key', label: 'Field Key' },
    { value: 'type', label: 'Field Type' },
    { value: 'name', label: 'Field Name' },
    { value: 'description', label: 'Description' },
    { value: 'permission', label: 'Permission Level' },
    { value: 'required', label: 'Required' },
    { value: 'descriptionForAgents', label: 'Description for Agents' },
    { value: 'descriptionForCustomers', label: 'Description for Customers' },
    { value: 'titleForAgents', label: 'Title for Agents' },
    { value: 'titleForCustomers', label: 'Title for Customers' },
    { value: 'enabled', label: 'Enabled' },
    { value: 'options', label: 'Options' }
  ]
};