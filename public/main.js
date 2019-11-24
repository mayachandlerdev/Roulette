let colors = ["Red", "Green", "Black"]
// let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
let usersBet = document.querySelector("#userBet")
let colorSelect = document.querySelector("#colorList")
// let numberSelect = document.querySelector("#numberList")
let submit = document.querySelector("#submit")

let tWins = 0
let tLost = 0
let mMade = 0
let mLost = 0


let outcome = []
outcome.push(colors.splice(Math.floor(Math.random()*colors.length), 1))
// &&
// outcome.push(numbers.splice(Math.floor(Math.random()*numbers.length), 1));

submit.addEventListener('click', function(){
    alert("Clicked the submit");
    if (colorSelect.options[colorSelect.selectedIndex].text != colors[Math.floor(Math.random() * 2)]){
        tLost++
        mMade += parseFloat(userBet.value)
        alert("you lost " + usersBet.value) //figure out how to correctly target this
        alert("casino made " + usersBet.value)
    }else{
        tWins++
        mLost += parseFloat(userBet.value);
        alert(+usersBet.value * 2)
    }
    fetch('casinolife', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body:    JSON.stringify({
//        numberValue: parseInt(('#numberValue').val()),
        'tWins': tWins,
        'tLost': tLost,
        'mMade': mMade,
        'mLost': mLost
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
})
