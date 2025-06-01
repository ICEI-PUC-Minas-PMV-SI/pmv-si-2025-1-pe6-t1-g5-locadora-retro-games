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
  Tooltip,
  NumberFormatter,
  Loader,
  Flex,
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

const purple = "#9333ea";

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
  loading,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);
  const showActions = data.length > 0 && actions.length > 0;

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    fetchData();
  }, [page, limit, fetchData]);

  const format = (row, header) => {
    if (header.key === "cpf") {
      return maskCpf(row[header.key]);
    }
    if (header.type === "boolean") {
      return row[header.key] ? "Sim" : "Não";
    }
    if (header.type === "currency") {
      return row[header.key] ? (
        <NumberFormatter
          prefix="R$ "
          decimalSeparator=","
          value={row[header.key]}
        />
      ) : (
        <NumberFormatter prefix="R$ " decimalSeparator="," value={0} />
      );
    }
    if (header.type === "longText") {
      return (
        <Tooltip
          label={row[header.key]}
          multiline
          maw={400}
          position="top-start"
        >
          <span
            style={{
              cursor: "pointer",
              display: "inline-block",
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row[header.key]}
          </span>
        </Tooltip>
      );
    }
    if (header.type === "date") {
      if (!row[header.key] || row[header.key] === "Invalid date") {
        return <span style={{ color: "#bbb" }}>–</span>;
      }
      const date = moment(String(row[header.key]));
      let isPast = false;

      if (header.key === "approveDate") {
        const returnDate = row.returnDate ? moment(String(row.returnDate)) : null;
        isPast = !returnDate && moment().isAfter(date.clone().add(15, 'days'));
      } else if (header.key === "returnDate") {
        const approveDate = row.approveDate ? moment(String(row.approveDate)) : null;
        isPast = approveDate && date.isAfter(approveDate.clone().add(15, 'days'));
      }

      return date.isValid() ? (
        <span style={{ color: isPast ? "red" : "inherit" }}>
          {date.format("DD/MM/YYYY HH:mm:ss")}
        </span>
      ) : (
        <span style={{ color: "#bbb" }}>–</span>
      );
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
                onClick={() => row.onStatusChange && row.onStatusChange(label)}
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
              color: field === header.key ? purple : "inherit",
            }}
          >
            {header.label}
            {field === header.key && (
              <span style={{ marginLeft: 4 }}>
                {order === "asc" ? (
                  <IconArrowUp size={12} color={purple} />
                ) : (
                  <IconArrowDown size={12} color={purple} />
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
                whiteSpace: header.key === "description" ? "nowrap" : undefined,
                overflow: header.key === "description" ? "hidden" : undefined,
                textOverflow:
                  header.key === "description" ? "ellipsis" : undefined,
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

  return loading ? (
    <Flex align="center" justify="center">
      <Loader />
    </Flex>
  ) : (
    <Box style={{ width: "100%" }}>
      <Group mb="md">
        <TextInput
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          leftSection={
            <div
              style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}
            >
              <IconSearch size={18} color={purple} />
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
                style={{ textAlign: "center", color: purple }}
              >
                Nenhum registro encontrado
              </MantineTable.Td>
            </MantineTable.Tr>
          )}
        </MantineTable.Tbody>
      </MantineTable>
      <Box
        mt="md"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Pagination
          total={Math.ceil(total / limit)}
          value={page}
          onChange={setPage}
          size="xs"
          pr={30}
          color="purple"
          styles={{
            control: { borderColor: purple },
            active: { backgroundColor: purple, color: "#fff" },
          }}
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
