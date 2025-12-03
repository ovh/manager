# Component Migration Diffs

Side-by-side comparisons for UI component patterns.

---

## Datagrid Basic

### AngularJS

```html
<oui-datagrid
  rows="$ctrl.services"
  page-size="10"
  page-size-options="[10, 25, 50]"
>
  <oui-column
    title="'Name'"
    property="serviceName"
    sortable
    searchable
  ></oui-column>
  <oui-column title="'Status'" property="status">
    <span ng-bind="$row.status | translate"></span>
  </oui-column>
  <oui-column title="'Actions'">
    <oui-action-menu>
      <oui-action-menu-item
        text="{{'edit' | translate}}"
        on-click="$ctrl.edit($row)"
      ></oui-action-menu-item>
      <oui-action-menu-item
        text="{{'delete' | translate}}"
        on-click="$ctrl.delete($row)"
      ></oui-action-menu-item>
    </oui-action-menu>
  </oui-column>
</oui-datagrid>
```

### React Equivalent

```typescript
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';

type Service = {
  serviceName: string;
  status: string;
};

const columns: DatagridColumn<Service>[] = [
  {
    id: 'serviceName',
    label: t('name'),
    cell: (row) => row.serviceName,
    isSortable: true,
  },
  {
    id: 'status',
    label: t('status'),
    cell: (row) => t(row.status),
  },
  {
    id: 'actions',
    label: t('actions'),
    cell: (row) => (
      <OdsPopover>
        <OdsButton slot="trigger" variant="ghost" icon="ellipsis-vertical" />
        <OdsButton
          variant="ghost"
          label={t('edit')}
          onClick={() => handleEdit(row)}
        />
        <OdsButton
          variant="ghost"
          label={t('delete')}
          onClick={() => handleDelete(row)}
        />
      </OdsPopover>
    ),
  },
];

return (
  <Datagrid
    columns={columns}
    items={services}
    pageSize={10}
    pageSizeOptions={[10, 25, 50]}
  />
);
```

### Transformation Rules

1. `<oui-datagrid rows="...">` → `<Datagrid items={...} />`
2. `<oui-column>` → Column definition object in array
3. `property="x"` → `cell: (row) => row.x`
4. `sortable` → `isSortable: true`
5. `title="'text'"` → `label: t('key')`
6. `ng-bind="... | translate"` → `t(value)` in cell function
7. `<oui-action-menu>` → `<OdsPopover>` with buttons

---

## Datagrid with Server-side Pagination

### AngularJS

```html
<oui-datagrid
  rows-loader="$ctrl.loadRows($config)"
  page-size="25"
>
  <!-- columns -->
</oui-datagrid>
```

```javascript
// Controller
$ctrl.loadRows = (config) => {
  return iceberg('/dedicated/nasha')
    .query()
    .expand('CachedObjectList-Pages')
    .limit(config.pageSize)
    .offset(config.offset)
    .sort(config.sort.property, config.sort.dir === 1 ? 'ASC' : 'DESC')
    .execute()
    .$promise;
};
```

### React Equivalent

```typescript
import { useDataApi } from '@ovh-ux/manager-react-components';

const ListingPage = () => {
  const {
    data,
    isLoading,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    sorting,
    setSorting,
  } = useDataApi({
    route: '/dedicated/nasha',
    queryKey: ['nasha', 'list'],
  });

  return (
    <Datagrid
      columns={columns}
      items={data ?? []}
      pageSize={pageSize}
      pageIndex={pageIndex}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
      sorting={sorting}
      onSortChange={setSorting}
      isLoading={isLoading}
    />
  );
};
```

### Transformation Rules

1. `rows-loader` → `useDataApi` hook
2. Manual pagination → Hook provides state and setters
3. `$config` → Destructured from hook
4. Server-side handled by hook internals

---

## Form with Validation

### AngularJS

```html
<form name="$ctrl.form" ng-submit="$ctrl.submit()">
  <oui-field label="{{'name_label' | translate}}">
    <input
      type="text"
      name="name"
      ng-model="$ctrl.formData.name"
      ng-minlength="3"
      ng-maxlength="50"
      required
    />
  </oui-field>

  <oui-field label="{{'email_label' | translate}}">
    <input
      type="email"
      name="email"
      ng-model="$ctrl.formData.email"
      ng-pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
      required
    />
  </oui-field>

  <oui-field label="{{'size_label' | translate}}">
    <oui-select
      name="size"
      ng-model="$ctrl.formData.size"
      items="$ctrl.sizeOptions"
      required
    ></oui-select>
  </oui-field>

  <button type="submit" ng-disabled="$ctrl.form.$invalid || $ctrl.loading">
    {{ 'submit' | translate }}
  </button>
</form>
```

### React Equivalent

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OdsInput, OdsSelect, OdsButton, OdsFormField } from '@ovhcloud/ods-components/react';

const schema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  size: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

const CreateForm = () => {
  const { t } = useTranslation('nasha');
  const mutation = useCreateNasha();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OdsFormField error={errors.name?.message}>
        <label slot="label">{t('name_label')}</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <OdsInput
              {...field}
              hasError={!!errors.name}
            />
          )}
        />
      </OdsFormField>

      <OdsFormField error={errors.email?.message}>
        <label slot="label">{t('email_label')}</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <OdsInput
              type="email"
              {...field}
              hasError={!!errors.email}
            />
          )}
        />
      </OdsFormField>

      <OdsFormField error={errors.size?.message}>
        <label slot="label">{t('size_label')}</label>
        <Controller
          name="size"
          control={control}
          render={({ field }) => (
            <OdsSelect {...field} hasError={!!errors.size}>
              {sizeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </OdsSelect>
          )}
        />
      </OdsFormField>

      <OdsButton
        type="submit"
        label={t('submit')}
        isDisabled={!isValid || mutation.isPending}
        isLoading={mutation.isPending}
      />
    </form>
  );
};
```

### Transformation Rules

1. `ng-model` → `Controller` from react-hook-form
2. `ng-minlength/maxlength` → Zod `min()/max()`
3. `ng-pattern` → Zod `regex()` or built-in validators
4. `required` → Zod schema (required by default)
5. `$ctrl.form.$invalid` → `!isValid` from formState
6. `ng-disabled` → `isDisabled` prop
7. `<oui-field>` → `<OdsFormField>`
8. `<oui-select>` → `<OdsSelect>`

---

## Modal

### AngularJS

```javascript
// Open modal
$uibModal.open({
  templateUrl: 'delete-modal.html',
  controller: 'DeleteModalCtrl',
  controllerAs: '$ctrl',
  resolve: {
    item: () => selectedItem,
  },
});

// delete-modal.html
<div class="modal-header">
  <h4>{{ 'delete_title' | translate }}</h4>
</div>
<div class="modal-body">
  <p>{{ 'delete_confirm' | translate:{ name: $ctrl.item.name } }}</p>
</div>
<div class="modal-footer">
  <button ng-click="$dismiss()">{{ 'cancel' | translate }}</button>
  <button ng-click="$ctrl.confirm()">{{ 'delete' | translate }}</button>
</div>
```

### React Equivalent

```typescript
import { OdsModal, OdsButton, OdsText } from '@ovhcloud/ods-components/react';

type DeleteModalProps = {
  item: { name: string };
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
};

const DeleteModal = ({ item, isOpen, onClose, onConfirm, isPending }: DeleteModalProps) => {
  const { t } = useTranslation('nasha');

  return (
    <OdsModal isOpen={isOpen} onOdsClose={onClose}>
      <OdsText preset="heading-4">{t('delete_title')}</OdsText>

      <OdsText>{t('delete_confirm', { name: item.name })}</OdsText>

      <OdsButton
        slot="actions"
        variant="outline"
        label={t('cancel')}
        onClick={onClose}
      />
      <OdsButton
        slot="actions"
        color="critical"
        label={t('delete')}
        onClick={onConfirm}
        isLoading={isPending}
      />
    </OdsModal>
  );
};

// Usage
const [isModalOpen, setModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const deleteMutation = useDeleteItem();

const handleDelete = (item) => {
  setSelectedItem(item);
  setModalOpen(true);
};

const confirmDelete = () => {
  deleteMutation.mutate(selectedItem.id, {
    onSuccess: () => setModalOpen(false),
  });
};

return (
  <>
    <Datagrid onDelete={handleDelete} />
    <DeleteModal
      item={selectedItem}
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      onConfirm={confirmDelete}
      isPending={deleteMutation.isPending}
    />
  </>
);
```

### Transformation Rules

1. `$uibModal.open()` → React state + Modal component
2. `resolve: { item }` → Props to modal component
3. `$dismiss()` → `onClose` callback
4. Controller logic → Handled in parent or custom hook
5. Template → JSX component

---

## Tile / Card

### AngularJS

```html
<oui-tile heading="{{$ctrl.nasha.displayName}}">
  <oui-tile-body>
    <oui-field label="{{'status' | translate}}">
      <span ng-bind="$ctrl.nasha.status"></span>
    </oui-field>
    <oui-field label="{{'region' | translate}}">
      <span ng-bind="$ctrl.nasha.region"></span>
    </oui-field>
  </oui-tile-body>
</oui-tile>
```

### React Equivalent

```typescript
import { Tile } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';

const NashaTile = ({ nasha }: { nasha: NashaType }) => {
  const { t } = useTranslation('nasha');

  return (
    <Tile>
      <Tile.Title>{nasha.displayName}</Tile.Title>
      <Tile.Content>
        <Tile.Item>
          <Tile.Label>{t('status')}</Tile.Label>
          <Tile.Value>{nasha.status}</Tile.Value>
        </Tile.Item>
        <Tile.Item>
          <Tile.Label>{t('region')}</Tile.Label>
          <Tile.Value>{nasha.region}</Tile.Value>
        </Tile.Item>
      </Tile.Content>
    </Tile>
  );
};
```

### Transformation Rules

1. `<oui-tile heading="...">` → `<Tile>` + `<Tile.Title>`
2. `<oui-tile-body>` → `<Tile.Content>`
3. `<oui-field>` inside tile → `<Tile.Item>` with Label/Value
4. `ng-bind` → Direct JSX expression

---

## Tabs

### AngularJS

```html
<oui-tabs>
  <oui-tabs-item heading="{{'overview' | translate}}">
    <nasha-overview nasha="$ctrl.nasha"></nasha-overview>
  </oui-tabs-item>
  <oui-tabs-item heading="{{'partitions' | translate}}">
    <nasha-partitions nasha="$ctrl.nasha"></nasha-partitions>
  </oui-tabs-item>
</oui-tabs>
```

### React Equivalent

```typescript
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { useState } from 'react';

const NashaDashboard = ({ nasha }: { nasha: NashaType }) => {
  const { t } = useTranslation('nasha');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <OdsTabs>
        <OdsTab
          isSelected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          {t('overview')}
        </OdsTab>
        <OdsTab
          isSelected={activeTab === 'partitions'}
          onClick={() => setActiveTab('partitions')}
        >
          {t('partitions')}
        </OdsTab>
      </OdsTabs>

      {activeTab === 'overview' && <Overview nasha={nasha} />}
      {activeTab === 'partitions' && <Partitions nasha={nasha} />}
    </>
  );
};
```

### Transformation Rules

1. `<oui-tabs>` → `<OdsTabs>` with state management
2. `<oui-tabs-item heading="...">` → `<OdsTab>` with onClick
3. Content rendered conditionally based on active tab
4. Tab state managed with `useState`
