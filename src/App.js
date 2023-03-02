import './App.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useReducer, useRef} from 'react';

export function Home() {
  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/fetch-data'>Fetch Data</Link>
        <Link to='/fetch-graphql'>Fetch GraphQL</Link>
        <Link to='/render-prop'>Render Prop</Link>
      </nav>
    </div> 
  )
}

export function RenderProp() {
  // Render Prop Componants
  const tahoe_peaks = [
    {name: 'Freel', elevation: 10891 },
    {name: 'Monument', elevation: 10067},
    {name: 'Pyramid', elevation: 9983},
    {name: 'Tallac', elevation: 9735}
  ];

  function List({data, renderItem, renderEmpty}) {
    return !data.length ?
      (renderEmpty) :
      (
        data.map((item) => (
          <li key={item.name}>{renderItem(item)}</li>
        ))
      );
  }

  function ItemDetails(item) {
    return <>{item.name} - {item.elevation}</>
  }
  
  return(
    <div className="App">      
      <Home /> 
      <div className='peak_div'>
          <h2>Render Props - Tahoe Peaks</h2>
        <ul>
          <List 
            data={tahoe_peaks} 
            renderEmpty='<h3>The List is Empty</h3>'
            renderItem = {ItemDetails}
          />
        </ul>
      </div>
    </div>
  )
}

export function FetchData() {
  // Fetch Componant
  function GitHubUser({name, location, avatar}) {
    return (
      <div>
        <h3>{name}</h3>
        <p>{location}</p>
        <img src={avatar} height='100' alt={name} />
      </div>
    );
  }

  // Fetch Data
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`https://api.github.com/users/moonhighway`)
    .then((response) => response.json())
    .then((data) => setData(data))
    .then(() => setLoading(false))
    .catch((e) => setError(e));
  }, []);

  if(loading) return <div className="App"><h1>Loading...</h1></div>;
  if(error) return <div className="App"><pre>{JSON.stringify(error)}</pre></div>;
  if(!data) return null;

  return (
    <div className="App">
      
      <Home />
      <div>
        <h2>Fetch Data</h2>   
        <GitHubUser 
          name={data.name} 
          location={data.location} 
          avatar={data.avatar_url} 
        />
      </div>
    </div>
  )
}

export function FetchGraphQL() {
  // Fetch GraphQL Componant
  const query = `
    query{
      allLifts{
        name
        elevationGain
        status
      }
    }
  `;

  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ query })
  }

  function GraphQLUser ({name, elevationGain, status}) {
    return(
      <div>
        <h5>{name}</h5>
        <p>{elevationGain} : {status}</p>
      </div>
    );  
  }

  // GraphQL Data
  const [dataGql, setDataGql] = useState(null);
  const [errorGql, setErrorGql] = useState(null);
  const [loadingGql, setLoadingGql] = useState(false);

  useEffect(() => {
    setLoadingGql(true);

    fetch('https://snowtooth.moonhighway.com/', opts)
    .then((response) => response.json())
    .then((data) => setDataGql(data))
    .then(() => setLoadingGql(false))
    .catch((e) => setErrorGql(e));
  }, []);  

  if(loadingGql) return <div className="App"><h1>Loading...</h1></div>;
  if(errorGql) return <div className="App"><pre>{JSON.stringify(errorGql)}</pre></div>;
  if(!dataGql) return null;
  
  return(
    <div className="App">
      <Home />
      <div>
        <h2>GraphQL Data</h2>   
        <div className='gql_div'>
          {
            dataGql.data.allLifts.map((lift) => (
              <GraphQLUser name={lift.name} elevationGain={lift.elevationGain} status={lift.status} />
            ))
          }
        </div>
        <hr />
      </div>
    </div>
  )
}

export function App() {
  
  //Custom Hoot
  function useInput(initialValue) {    
    const [value, setValue] = useState(initialValue);
    return[
      {value, onChange: (e) => setValue(e.target.value)},
      (initialValue) => setValue(initialValue),
    ];
  }

  const [titleProps, resetTitle] = useInput();
  const [colorProps, resetColor] = useInput('#000');

  const submitCustom = (e) => {
    e.preventDefault();
    console.log({...titleProps});
    alert(`${titleProps.value}: ${colorProps.value}`);
    resetTitle("");
    resetColor("");
  }

  // UseState
  const [ emtion, setEmotion] = useState('happy');
  const [secondary, setSecondary] = useState('tired');

  // UseState Controlled form element
  const [ title, setTitle] = useState();
  const [color, setColor ] = useState();

  const submitControll = (e) => {
    e.preventDefault();
    alert(`${title}: ${color}`);
    setTitle('');
    setColor('#000');
  }

  //UseEffect
  useEffect(() => {
    console.log(`It's ${emtion} right now`);
  }, [emtion, secondary]);

  useEffect(() => {
    console.log(`It's ${secondary} around here!`);
  }, [secondary]);

  // UseReducer
  const [checked, setChecked] = useReducer(
    (checked) => !checked,
    false
  );
  // UseRef
  const textTitle = useRef();
  const hexColor = useRef();

  const submit = (e) => {
    e.preventDefault();
    alert(e);
    const title = textTitle.current.value;
    const color = hexColor.current.value;
    alert(`${title}, ${color}`);
    textTitle.current.value = '';
    hexColor.current.value = '';
  }
  
  return (   
    
    <div className="App">      
      <Home />
      <h2>React Hooks - UseState | UseEffect | UseReducer | UseRef</h2>
      <div className='app-div'>       

        <h3>Custom Hook</h3>
        <form onSubmit={submitCustom}>
          <input type='text' placeholder='Color title' {...titleProps} />
          <input type='color' {...colorProps} />
          <button>Add</button>
        </form>
      </div>

      <div className='app-div'>
        <h3>UseState</h3>
        <form onSubmit={submitControll}>
          <input type='text' placeholder='Color title' 
            value={title} 
            onChange={(event) => setTitle(event.target.value)} 
          />
          <input type='color' 
            value={color} 
            onChange={(event) => setColor(event.target.value)} 
          />
          <button>Add</button>
        </form>
      </div>

      <div className='app-div'>
        <h3>UseRef</h3>
        <form onSubmit={submit}>
          <input type='text' placeholder='Color title...' ref={textTitle} />
          <input type='color' ref={hexColor} />
          <button>Add</button>
        </form>
      </div>

      <div className='app-div'>
        <h3>UseReducer</h3>
        <input type='checkbox' onChange={setChecked} value={checked} />
        <label>{checked ? 'Checked' : 'Not Check'}</label>
      </div>

      <div className='app-div'>
        <h3>UseState & UseEffect</h3>
        <h1>Current emtion is {emtion}</h1>
        <button onClick={ () => setEmotion('Sad')}>Sad</button>
        <button onClick={ () => setEmotion('Happy')}>Happy</button>
        <button onClick={ () => setEmotion('Angry')}>Angry</button>

        <h2>Current Secondary emotion is {secondary}</h2>
        <button onClick={() => setSecondary('Grateful')}>Grateful</button>
      </div>

    </div>
  );
}


