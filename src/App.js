import React, { Component } from 'react';
import './App.css';



class App extends Component {
  include
    constructor(props) {
        super(props);
        this.state = {
                temporadas: [],
                isLoaded: false,
                bool_episodes: false,
                episodes: [],
                episodio: '',
                bool_episodio: false,
                personaje: '',
                bool_personaje: false,
                quotes_personaje: '',
                value: '',
                lista_personaje_state: [],
                bool_buscado: false
        }
        this.searchHandler = this.searchHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    

    componentDidMount() {
         fetch('https://tarea-1-breaking-bad.herokuapp.com/api/episodes',
      {
        method: "GET",
        
      }
    )
        .then(res => res.json())
        .then(resultado_json => {
          var temporada_bb = 0;
          var temporada_bcs = 0;
          var episodios_bb = [];
          var episodios_bcs = [];
         //console.log(`${resultado_json.length}`);

          //recorro todos los episodios obtenidos y separo por serie
          for (let i=0; i<resultado_json.length; i+=1){
            
            //si es que es de Breaking bad lo agrego al array de bb
            if(resultado_json[i].series =='Breaking Bad'){
              
              episodios_bb.push(resultado_json[i]);
            }
            //si es que no es de bb, lo agrego al array de bcs
            else {
              episodios_bcs.push(resultado_json[i]);}
          }

          //recorro los episodios de bb y encuentro cuantas temporadas hay
          for (let i=0; i<episodios_bb.length; i+=1)
          {
            var temporadas_provisoria_bb = episodios_bb[i].season;
            if (parseInt(temporadas_provisoria_bb) > parseInt(temporada_bb)){
              temporada_bb = temporadas_provisoria_bb;
            }
            
          }

          //recorro los episodios de bcs y encuentro cuantas temporadas hay
          for (let i=0; i<episodios_bcs.length; i+=1)
          {
            var temporadas_provisoria_bcs = episodios_bcs[i].season;
            if (parseInt(temporadas_provisoria_bcs) > parseInt(temporada_bcs)){
              temporada_bcs = temporadas_provisoria_bcs;
            }
            
          }

          var temp_bb = [];
          var temp_bcs = [];
          //construyo un array con las temporadas de breaking bad
          for (let i=1; i<=temporada_bb; i+=1){
            temp_bb.push(i);
          }
          //construyo un array con las temporadas de better call saul
          for (let i=1; i<=temporada_bcs; i+=1){
            temp_bcs.push(i);
          }
          //Construyo un array con todas las temporadas
          var total_temporadas = [temp_bb, temp_bcs];
            this.setState({
                isLoaded: true,
                temporadas: total_temporadas,
                bool_buscado: false
            })
        });
    }

    clickHandler(valor){

      //primero distinguir por serie
      //si es una temporada de Breaking Bad
      if (valor[1] == 'BCS'){
        //busco en las temporadas de BB
        var serie = 'Better+Call+Saul';
        var t = valor[0]; //TEMPORADA
      }
      //si es una temporada de Better Call Saul
      else{
        var t = valor[0]; //TEMPORADA
        var serie = 'Breaking+Bad';
        //busco en las temporadas de Better Call Saul
      }

      fetch(`https://tarea-1-breaking-bad.herokuapp.com/api/episodes?series=${serie}`,
      {
        method: "GET",
        
      }
    ).then(res => res.json())
    .then(resultado_json => {
      //defino un array vacio
      var array_titulos = [];
      //recorro todos los episodios
      for (let i=0; i<resultado_json.length; i+=1){
        //reviso si corresponde a la temporada buscada
        if (resultado_json[i].season == t ){
          //guardo el titulo en mi array
          var titulo = resultado_json[i];
          array_titulos.push(titulo)
        }
        
      }
      this.setState({
        bool_episodes: true,
        episodes: array_titulos,
        bool_personaje: false,
        bool_episodio: false,
        bool_buscado: false,
      })
      
    });
    }

    episodeClicked(valor){

      this.setState({
        bool_episodio: true,
        episodio: valor,
        bool_episodes: false,
        //aca hice un cambio (agregue la linea de abajo)
        bool_personaje: false,
        bool_buscado: false,
      })
    }

    characterClicked(valor){
      //console.log("aki estoy")
      //tengo que buscar toda la informacion sobre el personaje recibido en valor y mostrarla, las temporadas deben ser clickeables
      var nombre = valor.split(" ");
      var string_listo = ""
      for (let i=0; i<nombre.length; i+=1){
        if (i!=0)
        {var string_parcial = "+"+ nombre[i] }
        else{var string_parcial = nombre[i]}
        string_listo =  string_listo + string_parcial
      }
      //console.log(string_listo)
      Promise.all([
        fetch(`https://tarea-1-breaking-bad.herokuapp.com/api/characters?name=${string_listo}`,
      {
        method: "GET"
        
      }).then(res => res.json()),
      fetch(`https://tarea-1-breaking-bad.herokuapp.com/api/quote?author=${string_listo}`,
      {
        method: "GET"
        
      }).then(res => res.json())
      ]).then(([urlOneData, urlTwoData]) => {
        
        this.setState({
            bool_personaje: true,
            bool_episodio: false,
            bool_episodes: false,
            personaje: urlOneData,
            bool_buscado: false,
            quotes_personaje:urlTwoData
        });
      }) 
    }

    searchHandler(valor) {
      this.setState({
        value: valor.target.value});
    }
     handleSubmit(event){
      //busco los personajes de 10 en 10 y voy iterando hasta que los tengo todos
      var buscado = this.state.value //variable que contiene el texto ingresado en la busqueda
      
      
      var lista_personajes = []
      
      //if (buscado.length == 0)
      //{
        for (let i=0; i<10; i+=1)//mientras que las paginas tengan 10 elementos sigo buscando
        { 
          //busco la primera pagina
         
          fetch(`https://tarea-1-breaking-bad.herokuapp.com/api/characters?name=${buscado}&limit=10&offset=${i*10}`,
      {
        method: "GET"
        
      }).then(res => res.json())
      .then(resultado_json => {
        if (resultado_json.length > 0){
          
          resultado_json.map(resultado => (lista_personajes.push(resultado.name)))
        }
        
        this.setState({
          //ista_personaje_state: lista_personajes,
          bool_buscado: true,
          bool_episodes: false,
          bool_episodio: false,
          bool_personaje: false,
          lista_personaje_state: lista_personajes
        });
      })
        }
     // }
      //else {
        /*fetch(`https://tarea-1-breaking-bad.herokuapp.com/api/characters?name=${buscado}`,
      {
        method: "GET"
        
      }).then(res => res.json())
      .then(resultado_json=> {
        //console.log(resultado_json)
        var lista_personajes = []
        resultado_json.map(personaje=> (lista_personajes.push(personaje.name)))
        this.setState({
          lista_personaje_state: lista_personajes,
          bool_buscado: true,
          bool_episodes: false,
          bool_episodio: false,
          bool_personaje: false
        });
        
      })*/
      //}
      event.preventDefault();
    }

    homeClicked(){
      this.setState({
        bool_buscado: false,
        bool_episodes: false,
        bool_episodio: false,
        bool_personaje: false
      });
    }

    render() {
      
        var {isLoaded, temporadas, bool_episodes, episodes, episodio, bool_episodio, bool_personaje, personaje, quotes_personaje, lista_personaje_state, bool_buscado} = this.state;

      //si debo mostrar la informacion de un episodio
      if (bool_buscado){
        return (
         <body>
           <div >
            <div id="buscador">
              <form align="right" onSubmit={this.handleSubmit}>
              <br></br>
              <br></br>
                <label > 
                  Buscador
                  <input type="text" value={this.state.value} onChange = {this.searchHandler}></input>
                </label>
                  <input type="submit" value="Submit"></input>
              </form>
            </div>
            <div id="inicio">
            <h1 id="titulo-inicio">Resultados</h1>
            <div id="episodios">
            {lista_personaje_state.map(personaje=>(
            <ul> 
              <button id="btn-personaje"onClick={this.characterClicked.bind(this, personaje)}>{personaje}</button>
            </ul>))}
            </div>
            
            </div>
            <button id="button-back" onClick={this.homeClicked.bind(this)}>Volver al Inicio</button>
          </div>
         </body>
          
        )
      }
      else {
        if (bool_personaje){
          if (personaje[0].appearance.length == 0){
            personaje[0].appearance = []}
          if (personaje[0].better_call_saul_appearance.length == 0){personaje[0].better_call_saul_appearance = []}
          return (
          <div id="general">
            <div id="buscador">
              <form align="right" onSubmit={this.handleSubmit}>
              <br></br>
              <br></br>
                <label > 
                  Buscador
                  <input type="text" value={this.state.value} onChange = {this.searchHandler}></input>
                </label>
                  <input type="submit" value="Submit"></input>
              </form>
            </div>

            <div id="inicio">
              <h1 id="titulo-inicio">{personaje[0].name}</h1><img id="imagen" src={personaje[0].img} width="150" height="200"></img>
              <h3>Nickname: {personaje[0].nickname}</h3> 
              <h3>Actor: {personaje[0].portrayed}</h3>
              
              <h3>Categoría: {personaje[0].category}</h3>
              <h3>Status: {personaje[0].status}</h3>
              <h3>Roles:   </h3>
                {personaje[0].occupation.map(trabajos => (
                  <li>{trabajos} </li>
    
                ))}
                
            
              <h3>Apariciones en Breaking Bad : 
                {personaje[0].appearance.map(aparicion => (
                  
                    <button id="boton_aparicion"  onClick={this.clickHandler.bind(this, [aparicion, "BB"])}>{aparicion} </button> 
    
                ))}
                
              </h3>
              <h3>Apariciones en Better Call Saul: 
                {personaje[0].better_call_saul_appearance.map(aparicion => (
          
                    <button id="boton_aparicion" onClick={this.clickHandler.bind(this, [aparicion, "BCS"])}>{aparicion} </button>
      
    
                ))}
                
              </h3>
              <h3>Quotes:   </h3>
                {quotes_personaje.map(quotes => (
                  <li>{quotes.quote} </li>
    
                ))}
  
            </div>
            <button id="button-back" onClick={this.homeClicked.bind(this)}>Volver al Inicio</button>
          </div>);
        }
        if (bool_episodio){
          return (
          <div id="general">
            <div id="buscador">
                <form align="right" onSubmit={this.handleSubmit}>
                  <br></br>
                  <br></br>
                  <label > 
                    Buscador
                    <input type="text" value={this.state.value} onChange = {this.searchHandler}></input>
                    </label>
                    <input type="submit" value="Submit"></input>
                  </form>
              </div>

              <div id="inicio">
                <h1 id="titulo-inicio">{episodio.title}</h1>
                <div id="episodios">
                <h3>Temporada: {episodio.season}</h3>
                <h3>Episodio: {episodio.episode}</h3>
                <h3>Fecha de estreno: {episodio.air_date.substr(0, 10)}</h3>
                <h3>Personajes: 
                  {episodio.characters.map(personaje => (
                    <ul>
                      <button id="btn-episode"onClick={this.characterClicked.bind(this, personaje)}>{personaje}</button>
                    </ul>
      
                  ))}
                </h3>
                </div>
                
              </div>
              <button id="button-back" onClick={this.homeClicked.bind(this)}>Volver al Inicio</button>
          </div>);
          
        }
        else {
           //si debo mostrar los episodes
           if (bool_episodes){
            //aca estoy mostrando los episodes
            return ( 
            <div id="general"> 
              <div id="buscador">
                      <form align="right" onSubmit={this.handleSubmit}>
                      <br></br>
                      <br></br>
                        <label > 
                          Buscador
                          <input type="text" value={this.state.value} onChange = {this.searchHandler}></input>
                        </label>
                          <input type="submit" value="Submit"></input>
                      </form>
                    </div>
                    <div id="inicio">
                      <h1 id="titulo-inicio"> Episodios</h1>
                      <div id="episodios">
                        {episodes.map(episodio => ( 
                          
                          <ul >
                            <a>{episodio.episode}. </a><button id="btn-episode" onClick={this.episodeClicked.bind(this, episodio)}>{episodio.title}</button>
                          </ul>))}
                      </div>
                      
                    </div>
                    <button id="button-back" onClick={this.homeClicked.bind(this)}>Volver al Inicio</button>
                  
            </div>);
            
          }
          //si debo mostrar las temporadas
          else 
          {
            if (!isLoaded) {
              return (
              <div id="general">
                <br></br>
                <br></br>
                <h1 align="center">Cargando...</h1>
              </div>);
          }
            else {
            
              return (
                  <div id="general">
                    <div id="buscador">
                      <form align="right" onSubmit={this.handleSubmit}>
                      <br></br>
                      <br></br>
                        <label > 
                          Buscador
                          <input type="text" value={this.state.value} onChange = {this.searchHandler}></input>
                        </label>
                          <input type="submit" value="Submit"></input>
                      </form>
                    </div>
                    
                    
                    <div id="inicio">
                    <h1 id="titulo-inicio"> Better Call Saul</h1>
                    <div id="temporadas">
                    <h2> Temporadas</h2>
                    
                    {temporadas[1].map(temporada => ( 
                       
                   
                        <button className='BB' id={temporada} onClick={this.clickHandler.bind(this,[temporada, 'BCS'])}>{temporada}</button>
                     ))}
                    </div>
                    </div>
                    
                    <div id="inicio">
                    <h1 id="titulo-inicio"> Breaking Bad</h1>
                    <div id="temporadas">
                      <h2> Temporadas</h2>
                      
                      {temporadas[0].map(temporada => ( 
                        
                          <button className='BB' id={temporada} onClick={this.clickHandler.bind(this, [temporada, 'BB'])}>{temporada}</button>
                        ))}   
                    </div>
                    </div>
                    
                    
                  </div>
              
                  
              );
          }
          
          }
        }
      }
      

       

        
    }
 
    


}

export default App;
