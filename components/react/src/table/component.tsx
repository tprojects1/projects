import React from 'react';
import { useEffect, useState } from 'react';
// import parse from 'date-fns/parse';
import { formattedString, getTheCurrentBreakpoint, repositionTheDataPanel } from '@projects/common';
import './styles.scss';
import '../toolbar/styles.scss';
import { DataPanel, PageControls, Tag, Toolbar } from '..';
import Fuse from 'fuse.js';
import { Row } from '../common';
// import useDeepCompare from '../../hooks/useDeepCompare';

let row: Row;

const Table = (
  {
    data = [],
    columns = [],
    defaultSortColumn = '',
    defaultSortOrder = 'descending',
    selectedRow = row,
    setSelectedRow = (row: Row | null) => { return row },
    uniqueStatuses = [],
    isEditable = false,
    hasPageControls = false,
    isSortable = false,
    isShowingADataPanel = false,
    setIsShowingADataPanel = (isShowing: boolean) => { return isShowing }
  }) => {

  const [allData, setAllData] = useState([...data]),
    [sortField, setSortField] = useState(defaultSortColumn || null), // Track currently sorted field
    [sortOrder, setSortOrder] = useState(defaultSortOrder || 'descending'), // Initial sort order (descending on load)
    [searchTerm, setSearchTerm] = useState(''),
    [showExactMatches, setShowExactMatches] = useState(false),
    [currentPage, setCurrentPage] = useState(1),
    [itemsPerPage, setItemsPerPage] = useState(20),
    [tableContainerWidth, setTableContainerWidth] = useState<number | null>(null),
    [checkedCount, setCheckedCount] = useState(0),
    containerSelector = '#table-container',
    handleSearchChange = (event: any) => {
      setSearchTerm(event.target.value.toLowerCase());
    },
    handleExactMatchToggle = (event: any) => {
      setShowExactMatches(event.target.checked);
    },
    filterData = (searchTerm: string, exactMatchOnly: boolean) => {

      if (searchTerm === '') {
        return allData; // Return all of the data if there isn't anything in the search
      } else {

        const searchTermLower = searchTerm.toLowerCase();

        return allData.filter((row) => {
          if (exactMatchOnly) {
            // Exact match logic (existing function)
            return Object.values(row).some((value: any) =>
              value.toString().toLowerCase().includes(searchTermLower)
            );
          } else {
            // Fuzzy match using Fuse.js
            const results = fuse.search(searchTermLower);
            return results.map((result: any) => result.item).includes(row);
          }
        });
      }
    },
    clearSearch = () => {
      setSearchTerm(''); // Reset the search term to clear the search results
    };

  let fuse: any,
    threshold = .4;

  if (allData[0] !== null && allData[0] !== undefined) {
    fuse = new Fuse(allData, {
      keys: Object.keys(allData[0]), // Adjust keys if needed
      threshold: threshold // Adjust for misspelling tolerance
    });
  }
  else {
    fuse = new Fuse(allData, {
      threshold: threshold
    });
  }

  const filteredData = filterData(searchTerm, showExactMatches),
    sortColumn = (column: any) => {
      const sortedAllData = [...allData].sort((a, b) => {

        if (column === sortField) {
          // Toggle sort order on the same field
          setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
        } else {
          // Sort by the new field
          setSortField(column);
          setSortOrder('ascending'); // Reset sort order for new field
        }

        // newData.sort((a, b) => {
        const valueA: any = a[column],
          valueB: any = b[column];

        if (typeof valueA === 'string') {
          return sortOrder === 'ascending'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA); // Locale-aware string comparison
        } else {
          return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA; // Numeric comparison
        }
        // });

      });

      setAllData(sortedAllData);
    };

  useEffect(() => {
    if (defaultSortColumn) sortColumn(defaultSortColumn);
    window.addEventListener('resize', function () {
      resizeTheTable();
    });
  }, []);

  const [rows] = useState([...filteredData]), getColumnName = (column: any) => {
    return formattedString(column).replace('Id', 'ID');
  },
    formattedColumns = columns.map((column) => (
      <th
        key={column}
        className={`table-header ${sortField === column ? (sortOrder === 'ascending' ? 'descending' : 'ascending') : ''}`}
        onClick={() => sortColumn(column)}
      >
        {isSortable ? (
          <div>
            <span>{getColumnName(column)}</span>
            <i />
          </div>
        ) : (
          getColumnName(column)
        )}
      </th>
    ));

  function resizeTheTable() {
    setTimeout(() => {
      const table = document.querySelector('table') as HTMLElement,
        dataPanel = document.querySelector('.data-panel') as HTMLElement,
        showTheDataPanel = () => {
          setTimeout(() => {
            repositionTheDataPanel();
            dataPanel?.classList.remove('hidden');
          }, 400);
        }

      /*if (getTheCurrentBreakpoint() == 'small') {
        table.style.width = '100%'
        if (dataPanel) {
          setIsShowingADataPanel(true);
          showTheDataPanel();
        }
        else setIsShowingADataPanel(false);
      }
      else {
        if (dataPanel) {
          table.style.width = 'calc(100% - ' + dataPanel.offsetWidth + 'px)';
          setIsShowingADataPanel(true);
          showTheDataPanel();
        }
        else {
          table.style.width = '100%';
          setIsShowingADataPanel(false);
        }
      }*/

      table.style.width = getTheCurrentBreakpoint() == 'small'
        ? '100%'
        : dataPanel ? `calc(100% - ${dataPanel.offsetWidth}px)` : '100%';

      setIsShowingADataPanel(!!dataPanel); // Use double negation for boolean conversion
      if (dataPanel) showTheDataPanel();


    });
  }

  const handleRowClick = (row: Row, id: number | string) => {

    if (document.querySelector('[data-id="' + id + '"]')?.className.includes('selected')) closePanel() // close the panel if the currently selected row is clicked

    else {

      deselectTheRow();

      document.querySelector('[data-id="' + id + '"]')?.classList.add('selected');

      setSelectedRow(row);
      /*(setTimeout(() => {
        try {

          const inputElement = document.querySelector('.data-panel').querySelector('[type="text"]');

          let currentValue = inputElement.value;

          currentValue += " ";
          currentValue = currentValue.slice(0, -1);
          inputElement.value = currentValue;

          inputElement.focus();
          inputElement.blur();
          console.log(inputElement)

          let event = new KeyboardEvent("type", {
            bubbles: true,
            cancelable: true,
            charCode: 0,
            keyCode: 0,
            key: "",
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            repeat: false,
            location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
          });

          setTimeout(() => {



            let enterEvent = new KeyboardEvent("keydown", {
              key: "x",  // Key property set to "x" for the letter 'x'
              keyCode: 88, // keyCode for 'x' is 88
              which: 88   // which property also set to 88 for consistency
            });

            const previousInputElementValue = inputElement.value;

            inputElement.value += 'x';
            inputElement.dispatchEvent(enterEvent);
            // inputElement.value = previousInputElementValue;

            inputElement.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 32, 'which': 32 }));
          });

        } catch (e) {
          console.error(e);
        }
      }, 1000);*/

    }

    resizeTheTable();

  };

  function deselectTheRow() {
    document.querySelectorAll('[data-id]').forEach(row => {
      row?.classList.remove('selected');
    });
  }

  function closePanel() {
    setSelectedRow(null);
    deselectTheRow();
    resizeTheTable();
  }

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    setTimeout(() => {

      if (container) {
        setTableContainerWidth(container.clientWidth);
        // Add event listener for when the window resize affects the width
        window.addEventListener('resize', () => {
          setTableContainerWidth(container.clientWidth);
        });
      }

    });

    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener('resize', () => { });
    };
  }, [containerSelector]);

  const styles = { width: tableContainerWidth ? `${tableContainerWidth}px` : 'auto' },
    handleRowCheckboxChange = (event: any, row: Row) => {
      const updatedRows: any = [...allData], rowIndex = updatedRows.findIndex((rowData: any) => rowData.id === row.id);

      row.isChecked = event.target.checked;
      setCheckedCount((prevCount) =>
        event.target.checked ? prevCount + 1 : prevCount - 1
      );

      if (rowIndex !== -1) {
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], isChecked: event.target.checked };
        setAllData(updatedRows);
      }
    },
    handleSelectAllClick = (event: any) => {
      const isChecked = event.target.checked;
      setAllData((rows: any) => rows.map((row: Row) => ({ ...row, isChecked })));
      setCheckedCount(isChecked ? rows.length : 0); // Update checkedCount
    };


  useEffect(() => {
    const allChecked = rows.every((row: Row) => row.isChecked);
    (document.getElementById('select-all') as HTMLInputElement).checked = allChecked; // Set the select all checkbox
  }, [rows]); // Update on changes to rows state

  useEffect(() => {
    if (checkedCount > 0) {
      const timer = setTimeout(() => {
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) toolbar.classList.remove('hidden');
      }, 500);

      // Cleanup the function to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [checkedCount]);

  return (
    <>
      <div className={`table ${isSortable ? 'sortable' : ''} ${isEditable ? 'editable' : ''} ${hasPageControls ? 'has-page-controls' : ''} ${isShowingADataPanel ? 'is-showing-a-data-panel' : ''}`}>
        <div id="search" style={styles}>
          <div className="search">
            <input type="search" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
          </div>
          <label htmlFor="toggle-exact-matches">
            <input type="checkbox" id="toggle-exact-matches" checked={showExactMatches} onChange={handleExactMatchToggle} />
            Show exact matches only
          </label>
        </div>
        <div id="table-container">
          {/* {checkedCount > 0 && (
            <Toolbar />
          )} */}
          <div>
            <table key={data.length}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="select-all"
                      onClick={handleSelectAllClick}
                    />
                  </th>
                  {formattedColumns}
                </tr>
              </thead>
              <tbody>
                {/* Display no results message if filteredData is empty */}
                {filteredData.length === 0 && searchTerm !== '' && (
                  <tr>
                    <td colSpan={columns.length} className='no-results'><h4>No Results</h4><p>There aren't any results for the term <strong>{searchTerm}</strong>, but you can try another search term or <a href="#" onClick={clearSearch}>view all of the table entries</a>.</p></td>
                  </tr>
                )}
                {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row: Row) => (
                  <tr key={row.id} data-id={row.id} onClick={() => handleRowClick(row, row.id)}>
                    <td>
                      <input
                        type="checkbox"
                        value={row.id} // Assuming each row has a unique id
                        checked={row.isChecked}
                        onChange={(event) => handleRowCheckboxChange(event, row)}
                        onClick={(event) => event.stopPropagation()}
                      // Add other necessary props for managing checked states
                      />
                    </td>
                    {columns.map((column) => (
                      <td key={column} data-name={column}>
                        {column === 'status' ? (
                          <Tag text={row[column]} />
                        ) : (
                          row[column]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isEditable ? (
            <DataPanel
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              uniqueStatuses={uniqueStatuses}
              onClose={() => closePanel()}
              onSave={(updatedData: Row) => {
                setAllData((prevData: any) =>
                  prevData.map((row: Row) =>
                    row.id === updatedData.id ? updatedData : row
                  )
                );
              }}
            />
          ) : ''}
        </div>
        <PageControls
          data={filteredData}
          visiblePageLinx={5}
          itemsPerPageOptions={[10, 20, 50]}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          containerSelector={containerSelector}
        />
      </div>
    </>
  );
};

export default Table;