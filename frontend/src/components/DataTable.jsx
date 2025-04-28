import { useDebouncedValue } from "@mantine/hooks";
import React, { memo, useMemo, useEffect, useState } from "react";
import {
  Table as MantineTable,
  Pagination,
  TextInput,
  Box,
  Group,
  Button,
  Badge,
  Menu,
} from "@mantine/core";
import moment from "moment";
import { IconArrowUp, IconArrowDown, IconSearch } from "@tabler/icons-react";
import { maskCpf } from "../utils/maskCpf";

const statusColors = {
  Reservado: "blue",
  Devolvido: "green",
  Cancelado: "red",
  Pendente: "yellow",
};

export const DataTable = ({
  headers,
  data,
  fetchData,
  total,
  limit,
  page,
  field,
  order,
  placeholder,
  setPage,
  setSearch,
  setField,
  setOrder,
  actions = [],
  onStatusChange,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);
  const showActions = data.length > 0 && actions.length > 0;

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // useEffect(() => {
  //   fetchData();
  // }, [page, limit, fetchData]);

  const format = (row, header) => {
    if (header.key === "cpf") {
      return maskCpf(row[header.key]);
    }
    if (header.type === "boolean") {
      return row[header.key] ? "Sim" : "Não";
    }
    if (header.type === "date") {
      if (!row[header.key] || row[header.key] === "Invalid date") {
        return <span style={{ color: "#bbb" }}>–</span>;
      }
      const date = moment(String(row[header.key]));
      return date.isValid()
        ? date.format("DD/MM/YYYY HH:mm:ss")
        : <span style={{ color: "#bbb" }}>–</span>;
    }
    if (header.key === "statusName" && row.statusName) {
      const color = statusColors[row.statusName] || "gray";
      return (
        <Menu shadow="md" width={160}>
          <Menu.Target>
            <Badge color={color} style={{ cursor: "pointer" }}>
              {row.statusName}
            </Badge>
          </Menu.Target>
          <Menu.Dropdown>
            {Object.entries(statusColors).map(([label, c]) => (
              <Menu.Item
                key={label}
                color={c}
                onClick={() =>
                  row.onStatusChange && row.onStatusChange(label)
                }
              >
                {label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      );
    }
    return row[header.key];
  };

  const handleHeaderClick = (headerKey) => {
    setField(headerKey);
    setOrder((e) => (e === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const tableHeaders = useMemo(
    () =>
      [
        ...headers.map((header) => (
          <MantineTable.Th
            key={String(header.key)}
            onClick={() => handleHeaderClick(String(header.key))}
            style={{
              width: header.width ? header.width : "auto",
              textAlign: header.align ? header.align : "left",
              cursor: "pointer",
              fontWeight: "bold",
              color: field === header.key ? "#0366d6" : "inherit",
            }}
          >
            {header.label}
            {field === header.key && (
              <span style={{ marginLeft: 4 }}>
                {order === "asc" ? (
                  <IconArrowUp size={12} color="#0366d6" />
                ) : (
                  <IconArrowDown size={12} color="#0366d6" />
                )}
              </span>
            )}
          </MantineTable.Th>
        )),
        showActions && (
          <MantineTable.Th key="actions" style={{ textAlign: "center" }}>
            Ações
          </MantineTable.Th>
        ),
      ].filter(Boolean),
    [headers, field, order]
  );

  const tableRows = useMemo(
    () =>
      data.map((row, rowIndex) => (
        <MantineTable.Tr key={rowIndex}>
          {headers.map((header) => (
            <MantineTable.Td
            style={{
              width: header.width ? header.width : "auto",
              maxWidth: header.key === "description" ? 220 : undefined,
              textAlign: header.align ? header.align : "left",
              whiteSpace: header.key === "description" ? 'nowrap' : undefined,
              overflow: header.key === "description" ? 'hidden' : undefined,
              textOverflow: header.key === "description" ? 'ellipsis' : undefined,
            }}
              key={String(header.key)}
              data-label={header.label}
            >
              {format(
                {
                  ...row,
                  onStatusChange: (newStatus) =>
                    onStatusChange && onStatusChange(row, newStatus),
                },
                header
              )}
            </MantineTable.Td>
          ))}
          {showActions && (
            <MantineTable.Td style={{ textAlign: "center" }}>
              {actions.map((action, idx) => (
                <Button
                  key={action.label || idx}
                  p="8"
                  variant="subtle"
                  onClick={() => action.onClick(row)}
                  title={action.label}
                  color={action.color || "gray"}
                  style={{ marginRight: 4 }}
                >
                  {action.icon}
                </Button>
              ))}
            </MantineTable.Td>
          )}
        </MantineTable.Tr>
      )),
    [data, headers, onStatusChange]
  );

  return (
    <Box style={{ overflowX: 'auto', width: '100%' }}>
      <Group mb="md">
        <TextInput
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          leftSection={
            <div
              style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}
            >
              <IconSearch size={18} color="#999" />
            </div>
          }
          style={{ flex: 1 }}
        />
      </Group>
      <MantineTable style={{ minWidth: 600 }}>
        <MantineTable.Thead>
          <MantineTable.Tr>{tableHeaders}</MantineTable.Tr>
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {tableRows.length > 0 ? (
            tableRows
          ) : (
            <MantineTable.Tr>
              <MantineTable.Td
                colSpan={headers.length}
                style={{ textAlign: "center" }}
              >
                Nenhum registro encontrado
              </MantineTable.Td>
            </MantineTable.Tr>
          )}
        </MantineTable.Tbody>
      </MantineTable>
      <Box
        mt="md"
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <Pagination
          total={Math.ceil(total / limit)}
          value={page}
          onChange={setPage}
          size="xs"
          pr={30}
        />
      </Box>
      <style>{`
        @media (max-width: 700px) {
          table, thead, tbody, th, td, tr { display: block !important; width: 100% !important; }
          thead { display: none !important; }
          td[data-label]:before {
            content: attr(data-label) ": ";
            font-weight: bold;
            color: #9333ea;
            display: block;
            margin-bottom: 2px;
          }
          td {
            border-bottom: 1px solid #eee;
            margin-bottom: 8px;
            padding-left: 8px;
          }
          td:has(button), td:has([data-action]) {
            text-align: left !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default memo(DataTable);
