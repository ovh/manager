import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-BenGHN5L.js";import{M as s}from"./index-EQhVOb-2.js";import"./index-Bnop-kX6.js";import"./iframe-BHu8F3gw.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function o(t){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...a(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Guidelines/React Templates/Modal Templates"}),`
`,e.jsx(n.h1,{id:"how-to-implement-modal",children:"How to implement Modal"}),`
`,e.jsxs(n.p,{children:["This guide explains how to implement different types of modals in the OVHcloud Manager using the ",e.jsx(n.code,{children:"@ovh-ux/manager-react-components"})," library."]}),`
`,e.jsx(n.h2,{id:"modal-in-routestsx-in-child-path",children:"Modal in Routes.tsx in child path"}),`
`,e.jsxs(n.p,{children:["To add a modal that can be accessed via URL, you need to define the route in your ",e.jsx(n.code,{children:"Routes.tsx"})," file. Here's how to set it up:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// In your Routes.tsx file
export default (
  return (
    <Routes>
      {/* Parent route */}
      <Route path="/resources" element={<ResourcesPage />}>
        {/* Child route for the modal */}
        <Route path=":id/modal" element={<ResourceModal />} />
      </Route>
    </Routes>
  );
)
`})}),`
`,e.jsx(n.h3,{id:"route-structure",children:"Route Structure"}),`
`,e.jsx(n.p,{children:"The route structure should follow this pattern:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Parent route: The main page where the modal will be opened"}),`
`,e.jsxs(n.li,{children:["Child route: The modal route, typically using a path like ",e.jsx(n.code,{children:":id/modal"})," or ",e.jsx(n.code,{children:"modal/:id"})]}),`
`]}),`
`,e.jsx(n.p,{children:"Example route patterns:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Simple modal route
<Route path="modal" element={<SimpleModal />} />

// Modal with resource ID
<Route path=":id/modal" element={<ResourceModal />} />
`})}),`
`,e.jsx(n.h2,{id:"modal-from-manager-react-components",children:"Modal from manager-react-components"}),`
`,e.jsx(n.p,{children:"The Modal component provides a consistent interface for displaying modal dialogs. Here's how to use it:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.a,{href:"?path=/docs/manager-react-components-components-modal-documentation--technical-information",children:"Here"}),", the component"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Modal } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

function MyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      heading="Modal Title"
      type={ODS_MODAL_COLOR.information}
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      primaryLabel="Confirm"
      onPrimaryButtonClick={() => {
        // Handle primary action
        setIsOpen(false);
      }}
      secondaryLabel="Cancel"
      onSecondaryButtonClick={() => setIsOpen(false)}
      isLoading={false}
    >
      <div>Modal content goes here</div>
    </Modal>
  );
}
`})}),`
`,e.jsx(n.p,{children:"To set up the route:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/path/to/modal/:id" element={<SubPathModal />} />
    </Routes>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"updatenamemodal",children:"UpdateNameModal"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"UpdateNameModal"})," component is a reusable modal for updating resource names or other text fields. It provides a consistent interface for name updates across the application."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.a,{href:"?path=/story/manager-react-components-templates-update-name-modal--update-name-modal",children:"Here"}),", the component"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { UpdateNameModal } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateName = async (newName) => {
    try {
      setIsUpdating(true);
      // API call to update name
      await updateResourceName(newName);
      setIsModalOpen(false);
    } catch (error) {
      // Handle error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Update Name</Button>
      {isModalOpen && (
        <UpdateNameModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdateName}
          currentName="Current Name"
          isSubmitting={isUpdating}
          title="Update Resource Name"
          submitLabel="Save Changes"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"props",children:"Props"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"UpdateNameModal"})," component accepts the following props:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`interface UpdateNameModalProps {
  onClose: () => void;              // Function to close the modal
  onSubmit: (newName: string) => void; // Function to handle name update
  currentName: string;              // Current name of the resource
  isSubmitting?: boolean;           // Whether the update is in progress
  title?: string;                   // Modal title (defaults to "Update Name")
  submitLabel?: string;             // Submit button label (defaults to "Save")
  cancelLabel?: string;             // Cancel button label (defaults to "Cancel")
  placeholder?: string;             // Input placeholder text
  error?: string;                   // Error message to display
}
`})}),`
`,e.jsx(n.h3,{id:"features",children:"Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Form validation"}),`
`,e.jsx(n.li,{children:"Loading state handling"}),`
`,e.jsx(n.li,{children:"Error display"}),`
`,e.jsx(n.li,{children:"Keyboard navigation"}),`
`,e.jsx(n.li,{children:"Accessible form controls"}),`
`,e.jsx(n.li,{children:"Consistent styling with OVHcloud design system"}),`
`]}),`
`,e.jsx(n.h2,{id:"deletemodal",children:"DeleteModal"}),`
`,e.jsx(n.p,{children:"A reusable confirmation modal for destructive actions:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.a,{href:"?path=/story/manager-react-components-templates-delete-modal--delete-modal",children:"Here"}),", the component"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Modal } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';

function DeleteModal({ onClose, onConfirm, resourceName, resourceType = 'resource' }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      // Handle error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      heading={\`Delete \${resourceType}\`}
      type={ODS_MODAL_COLOR.critical}
      isOpen={true}
      onDismiss={onClose}
      primaryLabel="Delete"
      onPrimaryButtonClick={handleConfirm}
      isPrimaryButtonLoading={isDeleting}
      secondaryLabel="Cancel"
      onSecondaryButtonClick={onClose}
    >
      <p>
        Are you sure you want to delete {resourceType} "{resourceName}"? 
        This action cannot be undone.
      </p>
    </Modal>
  );
}
`})}),`
`,e.jsx(n.p,{children:"Usage example:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    // API call to delete resource
    await deleteResource();
  };

  return (
    <>
      <Button variant="danger" onClick={() => setIsModalOpen(true)}>
        Delete Resource
      </Button>
      {isModalOpen && (
        <DeleteModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          resourceName="My Resource"
          resourceType="service"
        />
      )}
    </>
  );
}
`})})]})}function h(t={}){const{wrapper:n}={...a(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(o,{...t})}):o(t)}export{h as default};
