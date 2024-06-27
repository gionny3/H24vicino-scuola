// Funzione per controllare se un punto si trova all'interno di un'area circolare
function puntoInAreaCircolare(punto, centro, raggio) {
  console.log(punto,centro,raggio)
  const distanza = calcolaDistanzaTraPunti(punto, centro);
  return distanza <= raggio;
}

// Funzione per calcolare la distanza tra due punti sulla Terra
function calcolaDistanzaTraPunti(punto1, punto2) {
  const [lat1, lon1] = punto1;
  const [lat2, lon2] = punto2;

  distanza=Math.sqrt((lat1-lat2)^2+(lon1-lon2)^2)

  return distanza;
}

// Funzione per convertire gradi in radianti


module.exports=puntoInAreaCircolare