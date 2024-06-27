document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const openModalBtn = document.getElementById("setting"); // Assicurati che l'ID sia corretto
    const overlay = document.getElementById("overlay");
    const avviso = document.getElementById('avviso');

    // Aggiungiamo un gestore di eventi al pulsante di chiusura del modal
    closeModalBtn.addEventListener("click", ()=> {
        modal.classList.add("hidden");
        modal.style.display="none"
        overlay.style.display="none"
    });

    openModalBtn.addEventListener("click",()=>{
        modal.classList.remove("hidden")
        modal.style.display="block"
        overlay.style.display="block"
    });

    function Avviso() {
        avviso.classList.remove('hidden');
        console.log(avviso.classList)

        setTimeout(() => {
            avviso.classList.add('hidden');
        }, 2000);
    }

    function SendLogoutRequest(){
        axios.post("/logout")
        .then(()=>{
            console.log("avvenuto con successo")
        })
        .catch(err=>console.log(err))
    }

    document.getElementById("logoutButton").addEventListener("click", SendLogoutRequest);

    Avviso();
});
