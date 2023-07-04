import { Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import CopyTextButton from '../../components/buttons/CopyTextButton/CopyTextButton';
import { ContractInteraction, SmartWeaveActionInput } from '../../types';
import eventEmitter from '../../utils/events';
import { useIsMobile } from '../useIsMobile/useIsMobile';

export type InteractionMetadata = {
  function: string;
  id: string;
  creator: string;
  valid: { valid: boolean; error?: string };
  input: SmartWeaveActionInput;
  block: number;
};

function useInteractionsTable(interactions?: ContractInteraction[]) {
  const isMobile = useIsMobile();
  const [sortAscending, setSortOrder] = useState(true);
  const [sortField, setSortField] =
    useState<keyof InteractionMetadata>('block');
  const [selectedRow, setSelectedRow] = useState<InteractionMetadata>();
  const [rows, setRows] = useState<InteractionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [percent, setPercentLoaded] = useState<number>(0);

  useEffect(() => {
    if (!interactions) {
      return;
    }
    generateTableRows();
  }, [interactions]);

  function generateTableColumns(): ColumnType<InteractionMetadata>[] {
    return [
      {
        title: (
          <button
            className="flex-row pointer white"
            style={{ gap: '0.5em' }}
            onClick={() => setSortField('function')}
          >
            <span>FUNCTION</span>
          </button>
        ),
        dataIndex: 'function',
        key: 'function',
        ellipsis: true,
        onHeaderCell: () => {
          return {
            onClick: () => {
              rows.sort((a: InteractionMetadata, b: InteractionMetadata) =>
                // by default we sort by name
                !sortAscending
                  ? a.function.localeCompare(b.function)
                  : b.function.localeCompare(a.function),
              );
              // forces update of rows
              setRows([...rows]);
              setSortOrder(!sortAscending);
            },
          };
        },
      },
      {
        title: (
          <button
            className="flex-row pointer white"
            style={{ gap: '0.5em' }}
            onClick={() => setSortField('id')}
          >
            <span>ID</span>
          </button>
        ),
        dataIndex: 'id',
        key: 'id',
        render: (val: string) =>
          val ? (
            <div
              className="flex flex-column flex-center"
              style={{ position: 'relative' }}
            >
              <CopyTextButton
                wrapperStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                size={'70%'}
                copyText={val}
                displayText={`${val.slice(0, 4)}...${val.slice(-4)}`}
              />
            </div>
          ) : (
            val
          ),
        onHeaderCell: () => {
          return {
            onClick: () => {
              rows.sort((a: any, b: any) =>
                sortAscending
                  ? a.id.localeCompare(b.id)
                  : b.id.localeCompare(a.id),
              );
              // forces update of rows
              setRows([...rows]);
              setSortOrder(!sortAscending);
            },
          };
        },
      },
      {
        title: (
          <button
            className="flex-row pointer white"
            style={{ gap: '0.5em' }}
            onClick={() => setSortField('creator')}
          >
            <span>CREATOR</span>
          </button>
        ),
        dataIndex: 'creator',
        key: 'creator',
        render: (val: string) =>
          val ? (
            <div
              className="flex flex-column flex-center"
              style={{ position: 'relative' }}
            >
              <CopyTextButton
                wrapperStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                size={'70%'}
                copyText={val}
                displayText={`${val.slice(0, 4)}...${val.slice(-4)}`}
              />
            </div>
          ) : (
            val
          ),
        onHeaderCell: () => {
          return {
            onClick: () => {
              rows.sort((a: any, b: any) =>
                sortAscending
                  ? a.creator.localeCompare(b.creator)
                  : b.creator.localeCompare(a.creator),
              );
              // forces update of rows
              setRows([...rows]);
              setSortOrder(!sortAscending);
            },
          };
        },
      },
      {
        title: (
          <button
            className="flex-row pointer white"
            style={{ gap: '0.5em' }}
            onClick={() => setSortField('valid')}
          >
            <span>VALID</span>
          </button>
        ),
        dataIndex: 'valid',
        key: 'valid',
        ellipsis: true,
        render: (val: { valid: boolean; error?: string }) =>
          val.valid ? (
            'valid'
          ) : (
            <Tooltip
              color={'crimson'}
              defaultOpen={false}
              placement="left"
              title={val?.error}
            >
              <span style={{ color: 'red' }}>invalid</span>
            </Tooltip>
          ),
      },
      {
        title: (
          <button
            className="flex-row pointer white"
            style={{ gap: '0.5em' }}
            onClick={() => setSortField('input')}
          >
            <span>INPUT</span>
          </button>
        ),
        render: (interactionInput: SmartWeaveActionInput) => (
          <Tooltip
            autoAdjustOverflow
            placement="topLeft"
            overlayStyle={{ width: 'fit-content' }}
            overlayInnerStyle={{ width: 'fit-content', overflowY: 'scroll' }}
            defaultOpen={false}
            title={
              <>
                <ReactJson
                  src={interactionInput}
                  theme={'ashes'}
                  shouldCollapse={(field) =>
                    field.name === 'records' ||
                    field.name === 'balances' ||
                    field.name === 'auctions' ||
                    field.name === 'reserved'
                      ? true
                      : false
                  }
                  name={'state'}
                  groupArraysAfterLength={100}
                  quotesOnKeys={false}
                />
              </>
            }
          >
            {JSON.stringify(interactionInput).slice(0, 30)}...
          </Tooltip>
        ),
        dataIndex: 'input',
        key: 'input',
        ellipsis: true,
      },

      {
        title: (
          <button
            className="flex-row pointer white"
            style={{ gap: '0.5em' }}
            onClick={() => setSortField('block')}
          >
            <span>BLOCK</span>
          </button>
        ),
        render: (block: number) => block,
        dataIndex: 'block',
        key: 'block',
        ellipsis: true,
        onHeaderCell: () => {
          return {
            onClick: () => {
              rows.sort((a: any, b: any) =>
                sortAscending ? a.block - b.block : b.block - a.block,
              );
              // forces update of rows
              setRows([...rows]);
              setSortOrder(!sortAscending);
            },
          };
        },
      },
    ];
  }

  function generateTableRows() {
    setIsLoading(true);
    const fetchedRows: InteractionMetadata[] = [];

    if (!interactions) {
      return;
    }

    for (const interaction of interactions) {
      try {
        const rowData = {
          function: interaction.input.function,
          id: interaction.id,
          creator: interaction.owner,
          valid: { valid: interaction.valid, error: interaction.error },
          input: interaction.input,
          block: interaction.height,
        };
        // sort by confirmation count (ASC) by default
        
        fetchedRows.push(rowData);
        fetchedRows.sort((a, b) => b.block - a.block);
      } catch (error) {
        console.error(error);
      } finally {
        setPercentLoaded(
          ((interactions.indexOf(interaction) + 1) / interactions.length) * 100,
        );
      }
    }
    setRows(fetchedRows);
    setIsLoading(false);
  }

  return {
    isLoading,
    percent,
    columns: generateTableColumns(),
    rows,
    sortField,
    sortAscending,
    selectedRow,
  };
}

export default useInteractionsTable;
