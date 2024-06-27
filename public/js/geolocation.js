let latitudine
let longitudine
//un altro modo per prender l'inidirzzo ip di un utette potrebbe essere l'utilizzo di una api
// che prende l'indirizzo e lo passa come argomento https://ip-api.com/
//l'unico problema è che credo non sia accurato
$(document).ready(function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitudine = position.coords.latitude
      longitudine = position.coords.longitude
      console.log(longitudine)
      console.log(latitudine)

      fetch(`https://${"79.40.109.241"}:49200`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: latitudine,
          longitude: longitudine,
          Nresult: "3",
          range: "6"
        }),
      })
      .then(function(res) {
        return res.json()
      })
      .then((data)=>{
        modifyDOM(data)
      })
      .catch(err=>console.log(err))
    }, function(err) {
      window.alert("L'app potrebbe non funzionare correttamente se non permetti l'uso della geolocalizzazione")
    },{enableHighAccuracy:true})
  } else {
    window.alert("Il tuo browser non implementa un sistema di geolocalizzazione, l'app potrebbe non funzionare")
  }
})


// https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=41.90374%2C12.46104%3B41.90437%2C12.45867#map=19/41.90405/12.45986
// #map=coordinate utente
// engine=fossgis_osrm_foot
//https://www.openstreetmap.org/directions?from=&to=41.90399%2C12.45945

function SendRequest() {
  if (!latitudine || !longitudine) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitudine = position.coords.latitude
      longitudine = position.coords.longitude
    }, function(err) {
      console.log("Errore durante il recupero della posizione", err)
    },{enableHighAccuracy:true})
  } else {
    let inputRange
    let inputNresult
    if($(window).width()>1050){
      inputNresult= $("#Nresult").val()
      inputRange= $("#distanza").val()
    }else{
      inputNresult=$("#NresultTel").val()
      inputRange= $("#distanzaTel").val()
    }
     
    
    
    fetch(`https://${"79.40.109.241"}:49200`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: latitudine,
        longitude: longitudine,
        Nresult: inputNresult,
        range: inputRange
      }),
    })
    .then(function(res) {
      return res.json()
    })
    .then(function(data) {
      modifyDOM(data)
      
    })
    .catch(function(err) {
      console.log(err)
    })
  }
}


function modifyDOM(data){
  const resultsDiv = $("#resContainer")
  const resultsContainer = $("#res")
  resultsContainer.html("")
  
  data.forEach(function(macchinetta) {
    const macchinettaDiv = $("<div class='flex justify-normal items-center bg-purple-900 bg-opacity-50 w-full'></div>")
    const nomeDiv = $("<div class='border-r-[0.075em] sm:w-3/12 text-start p-6 h-28 md:items-center xxxs:w-6/12'></div>").html("<h1 class='text-stone-100 sm:text-[0.975rem] lg:text-lg xl:text-xl xxxs:text-xl '>" + macchinetta.nome + "</h1>")
    const viaDiv = $("<div class='border-r-[0.075em] sm:w-3/12 text-start p-6 h-28 md:items-center sm:block xxxs:hidden '></div>").html("<h1 class='text-stone-100 sm:text-[0.975rem] lg:text-lg xl:text-xl xxxs:text-xl '>" + macchinetta.luogo + "</h1>")
    const ComuneDiv = $("<div class='border-r-[0.075em] sm:w-3/12 text-start p-6 h-28 md:items-center sm:block xxxs:hidden '></div>").html("<h1  class='text-stone-100 sm:text-[0.975rem] lg:text-lg xl:text-xl xxxs:text-[0.7em]'>" + macchinetta.Comune.nome + "</h1>")
    const linkDiv = $("<div class='sm:w-3/12 text-start p-6 h-28 md:items-center xxxs:w-6/12'></div>").html(`<a class='text-stone-100 sm:text-[0.975rem] lg:text-lg xl:text-xl xxxs:text-xl' target='_blank' href='https://www.openstreetmap.org/directions?from=${latitudine}%2C${longitudine}&to=${macchinetta.posizione.coordinates[0]}%2C${macchinetta.posizione.coordinates[1]}'>Clicca qua</a>`)
    
    macchinettaDiv.append(nomeDiv)
    macchinettaDiv.append(viaDiv)
    macchinettaDiv.append(ComuneDiv)
    macchinettaDiv.append(linkDiv)

    resultsContainer.append(macchinettaDiv)
  })
  
  resultsDiv.append(resultsContainer)
}