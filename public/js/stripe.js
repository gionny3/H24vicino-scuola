let stripe=Stripe("pk_test_51PCNWJ04Be2YLbccnvmZ2anl67LmF13yzAkNPdhIXTKCB6jUD7AtdqGdRMlvCJWUzhkB7i8r3b0Aix5d3YB2V4F900S9muD9sT")
    let btnDona=document.getElementById("donazione-btn")
    btnDona.addEventListener("click",()=>{
      stripe.redirectToCheckout({
        sessionId:"<%=sessionId%>"
      })
    })