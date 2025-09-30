import { render, screen, within, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlavorsTable, TableColumn, TableRow } from '../FlavorsTable.component';
import { Badge, Icon, Text } from '@ovhcloud/ods-react';

describe("FlavorsTable", () => {
  const columns: TableColumn[] = [
    { key: "name", label: <Text>Name</Text> },
    { key: "memory", label: <Text>Memory (Go)</Text> },
    { key: "vcore", label: <Text>vCore</Text> },
  ];

  const rows: TableRow[] = [
    {
      id: "b3-8",
      name: "b3-8",
      memory: "8",
      vcore: "2",
    },
    {
      id: "b3-16",
      name: <Text className={"font-normal"}>b3-16</Text>,
      memory: "16",
      vcore: "4",
    },
    {
      id: "b3-256",
      name: <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
        <Text className={"font-normal"}>b3-256</Text>
        <Badge className="h-fit text-wrap font-normal">Unavailable
          <Icon aria-label="Info" name="circle-info" role="img"/>
        </Badge>
      </div>,
      memory: "256",
      vcore: "128",
    },
  ];

  it("renders with the correct number of columns and rows", () => {
    render(<FlavorsTable caption="Test caption" columns={columns} rows={rows} />);

    const table = screen.getByRole("table");
    const columnHeader = within(table).getAllByRole("columnheader");
    const tableRows = within(table).getAllByRole("row");

    expect(columnHeader).toHaveLength(columns.length);
    expect(tableRows.length).toBe(rows.length + 1); // +1 pour le header
  });

  it("displays column headers", () => {
    render(<FlavorsTable caption="Flavors" columns={columns} rows={rows} />);

    ["Name", "Memory (Go)", "vCore"].forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  it("display all data rows", () => {
    render(<FlavorsTable caption="Flavors" columns={columns} rows={rows} />);

    expect(screen.getByText("b3-8")).toBeInTheDocument();
    expect(screen.getByText("b3-16")).toBeInTheDocument();

    expect(screen.getByText("b3-256")).toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();

    expect(screen.getByLabelText("Info")).toBeInTheDocument();

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByText("256")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
  });

  it("calls the onClick function when a row is clicked", () => {
    const onClick = vi.fn();
    render(<FlavorsTable caption="Flavors" columns={columns} rows={rows} onClick={onClick} selectable />);

    const row = screen.getByText("b3-8").closest("tr")!;
    fireEvent.click(row);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("adds hover classes when selectable", () => {
    render(<FlavorsTable caption="Flavors" columns={columns} rows={rows} selectable />);

    const firstRow = screen.getByText("b3-8").closest("tr");
    expect(firstRow).toHaveClass("group cursor-pointer");
  });

  it("do not apply selection classes when not selectable", () => {
    render(<FlavorsTable caption="Flavors" columns={columns} rows={rows} selectable={false} />);

    const firstRow = screen.getByText("b3-8").closest("tr");
    expect(firstRow).not.toHaveClass("group cursor-pointer");
  });
});
