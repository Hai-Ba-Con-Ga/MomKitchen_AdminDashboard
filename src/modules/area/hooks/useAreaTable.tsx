import { AreaAdmin } from "@/types/@mk/entity/area";
import {
  CloseOutlined,
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
} from "@ant-design/icons";
import { Tooltip } from "@mui/material";
import { Stack, useTheme } from "@mui/system";
import { createColumnHelper } from "@tanstack/react-table";
import IconButton from "@ui/@extended/IconButton";
import { IndeterminateCheckbox } from "@ui/third-party/ReactTable";
import { MouseEvent, useMemo } from "react";
import NumberFormat from "react-number-format";

type Props = {
  handleEditClick?: (area: AreaAdmin) => void;
};

const useAreaTable = (props: Props) => {
  const { handleEditClick } = props;
  const theme = useTheme();
  const columnHelper = createColumnHelper<AreaAdmin>();
  // const [orderDetail, setOrderDetail] = useState(null);
  const columns = useMemo(
    () => {
      const cols = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columnHelper.accessor<any, any>("selection", {
          header: ({
            table: {
              getIsAllRowsSelected,
              getIsSomeRowsSelected,
              getToggleAllRowsSelectedHandler,
            },
          }) => (
            <IndeterminateCheckbox
              {...{
                checked: getIsAllRowsSelected(),
                indeterminate: getIsSomeRowsSelected(),
                onChange: getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({ row }) => (
            <IndeterminateCheckbox
              indeterminate={false}
              checked={row.getIsSelected()}
            />
          ),
          enableSorting: false,
        }),
        columnHelper.accessor("id", {
          header: "#",
        }),
        columnHelper.accessor("name", {
          header: "Area Name",
        }),
        columnHelper.accessor("noOfKitchen", {
          header: "Number of kitchens",
          cell: ({ renderValue }) => (
            <NumberFormat displayType="text" defaultValue={renderValue()} />
          ),
        }),
        columnHelper.accessor("createdDate", {
          header: "Status",
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columnHelper.accessor<any, any>("action", {
          header: "Actions",
          enableSorting: false,
          cell: ({ row }) => {
            const collapseIcon = row.getIsExpanded() ? (
              <CloseOutlined
                rev={{}}
                style={{ color: theme.palette.error.main }}
              />
            ) : (
              <EyeTwoTone
                rev={{}}
                twoToneColor={theme.palette.secondary.main}
              />
            );
            return (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={0}>
                <Tooltip title="View">
                  <IconButton
                    color="secondary"
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      row.toggleExpanded();
                    }}>
                    {collapseIcon}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      handleEditClick(row.original);
                    }}>
                    <EditTwoTone rev={{}} color={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                    }}>
                    <DeleteTwoTone rev={{}} color={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          },
        }),
      ];
      return cols;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return {
    columnsDef: columns,
  };
};

export default useAreaTable;
