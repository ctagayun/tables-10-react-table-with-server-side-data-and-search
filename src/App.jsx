/*
 Links to Review:
   Fundamenals of React by Guijt
     https://app.pluralsight.com/library/courses/react-18-fundamentals/table-of-contents
  
   Memo Hook (Guijt): 
    https://app.pluralsight.com/ilx/video-courses/clips/b25f237e-cbe2-464b-a491-cb9628075aae

   React Memo (Guijt)
     https://app.pluralsight.com/ilx/video-courses/9a3771fa-626e-4708-8634-c49cc8616922/4b5d269c-f9d9-4c3e-9806-ce1374a69d83/484af4ab-c2cc-4a89-beb1-b99d0e587620

   Pure Functions and Memoizing (Guijt)
      https://app.pluralsight.com/ilx/video-courses/clips/484af4ab-c2cc-4a89-beb1-b99d0e587620
   ======================================================
Task: 
  - React Table with server-side Data

  - Featuring examples of server-side pagination, 
    server-side search and filter, and server-side sort. 

  - https://www.robinwieruch.de/react-server-side-table/
  - npm install @table-library/react-table-library styled-components
==========================================================
Previous Task: React Table with Search
  - https://www.robinwieruch.de/react-table-search/

==========================================================
Previuos Task: Double Click
   - https://www.robinwieruch.de/react-table-double-click/

   - add the following in the table <row>
=======================================================
 Previous Task:
  - React Table with pagination - https://www.robinwieruch.de/react-table-pagination/
     
  - first import pagination hook
========================================================
Previous Task: 
    Enable your users to sort columns in the table by clicking on 
    a column's header.

    - import hook:
        import { useSort } from '@table-library/react-table-library/sort';

    - see https://www.robinwieruch.de/react-table-sort/

    - mui migration from V4 to V5 - https://mui.com/material-ui/migration/migration-v4/
       npm install @mui/icons-material
         or this :

      npm install @mui/material @mui/styles
      npm install @emotion/react @emotion/styled
====================================================
Previous Task: 
    Enable users to select a row in the table by either clicking 
    the row or clicking a checkbox using custom select components. 
    (MaterialCheckbox)

    - https://mui.com/material-ui/getting-started/installation/
    - npm install @mui/material @emotion/react @emotion/styled

    - Material UI uses Emotion as its default styling engine. 
      If you want to use styled-components instead, run one of 
      the following commands:
      npm install @mui/material @mui/styled-engine-sc styled-components
  ================================================
  Previous Task: 
    Enable users to select a row in the table by either clicking 
    the row or clicking a checkbox.

*/

import * as React from 'react';
import './App.css'
import axios from 'axios'
import { usePagination } from '@table-library/react-table-library/pagination';
import { useTheme } from '@table-library/react-table-library/theme';
import { useRowSelect, //will enable users to select a row
         SelectTypes,
      } from '@table-library/react-table-library/select';

//Import stuff from React Table Library
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
  useCustom,
} from '@table-library/react-table-library/table';

//Sort stuff
import { useSort, HeaderCellSort,
   } from '@table-library/react-table-library/sort';

//Sometimes we want to use custom sort icon
import MaterialButton from '@mui/material/Button';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const THEME = {
  BaseRow: `
    font-size: 14px;
  `,
  HeaderRow: `
    background-color: #eaf5fd;
  `,
  Row: `
    &:nth-child(odd) {
      background-color: #d2e9fb;
    }

    &:nth-child(even) {
      background-color: #eaf5fd;
    }
  `,
};

const BASE_URL = 'http://hn.algolia.com/api/v1/search';

//Dictionary K/V to be used in providing parameters to 
//search query string
const INITIAL_PARAMS = {
  search: 'react',
  filter: false,
};


/*=======================================
             App section
========================================*/
const App = () => {

  //Setup a react sate called "data". Initial state nodes: 
  //is set to empty list. set the nodes as an empty list as 
  //the initial state.  //Table Library will render the Table component for the fetched list:
  
  //nodes: [] - means a list is renamed to "nodes"
  const [data, setData] = React.useState({ nodes: [] });

  console.log("Nodes: " + data);

  //A useCallBack() function hook creates a memoized function
  //every time its dependency array changes. As result 
  //useEffect hook  fetchData() runs again  
  //because it depends on the new memoized function 
  //"fetchData"

  const fetchData = React.useCallback(async (params) => {  
    let url = `${BASE_URL}?query=${params.search}`;

    if (params.filter) {
      url = `${url}&tags=ask_hn`;
    }
    const result = await axios.get(url);
  
    //Call state updater and update the state "nodes"
    setData({ nodes: result.data.hits });

    const myResult = JSON.stringify(result);
    console.log("Fetched the following data: " + myResult);
     

  }, []);

  //Memoize this useEffect() by using callBack() hook
  // 1. Move all the data fetching logic from the side-effect 
  //    into a arrow function expression (A)
  // 2. Then wrapping this new function into React.useCallback (B)
  // 3. and invoking it in the useEffect hook (C):
  //We wrapped the whole function using useCallBack hook (B)
  //      useCallBack function hook creates a memoized function
  //      every time its dependency array (E) changes as result 
  //      useEffect hook  handleFetchStories() runs again (C)
  //      because it depends on the new memoized function "handleFetchStories"

  React.useEffect(() => {   
    fetchData({
        search: INITIAL_PARAMS.search, 
        filter: INITIAL_PARAMS.filter, 
            //invoke fetch from useEffect. Extract the search
            //parm from INITIAL_PARAM object
    });   
  }, [fetchData]);  

  //server-side search
  const [search, setSearch] = React.useState(INITIAL_PARAMS.search);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  //We need a way to be notified of the changing search state
  //so the we can perform another server-side request. We can
  //do this using "useCustom" hook.

  //With the 'useCustom' hook, we can define a key for the 
  //state ("search"), a state object ("data"), and a callback 
  //function which notifies us whenever the state object 
  //changes:
  useCustom('search', data, {
    state: { search },
    onChange: onSearchChange, 
        //callback function to notify us when there is 
        //change in search parameter
  });
 
  
  //listeners
  //you may have noticed that we perform a request with 
  //every keystroke made in the search field. We can 
  //debounce this with some JavaScript:
  const timeout = React.useRef();
  function onSearchChange(action, state) {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(
      () =>
        fetchData({
          search: state.search,
        }),
      500
    );
  }

  // server-side filter
  const [filter, setFilter] = React.useState(INITIAL_PARAMS.filter);

  const handleFilter = (event) => {
    setFilter(event.target.checked);
  };

  //list is renamed to "nodes". Nodes is a property of data
  //Nodes are the items in our list. In this example
  //"data" is prop to the Table component.

  //Using theme
  const theme = useTheme(THEME);
    
  return (
    <> 
      <label htmlFor="search">
        Search by Task:
        <input id="search" 
               type="text" 
               value={search} 
               onChange={handleSearch} />
      </label>
       
      <label htmlFor="filter">
        <input
          id="filter"
          type="checkbox"
          checked={filter}
          onChange={handleFilter}
        />
           Only Ask HN
      </label> 

      <Table data={data} theme={theme} > 
        {(tableList) => (
          <> 
          <Header>
            <HeaderRow>
              <HeaderCell>Title</HeaderCell>
              <HeaderCell>Created At</HeaderCell>
              <HeaderCell>Points</HeaderCell>
              <HeaderCell>Comments</HeaderCell>
            </HeaderRow>

          </Header>
          <Body>
            {tableList.map((item) => (
              <Row key={item.objectID} item={item}>
                <Cell>
                  <a href={item.url}>{item.title}</a>
                </Cell>
                <Cell>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </Cell>
                <Cell>{item.points}</Cell>
                <Cell>{item.num_comments}</Cell>
              </Row>
            ))}
          </Body>
       </> //EOF Fragment
      )}
      </Table> 

        </>
  );
};


export default App
