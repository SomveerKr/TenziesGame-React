import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rollCount, setRollCount] = React.useState(0)
  const [timer, setTimer] = React.useState({ minutes: 0, seconds: 0 })

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld)
    const firstDieImage = dice[0].dieImage
    const allSameDieImage = dice.every((die) => die.dieImage === firstDieImage)
    if (allHeld && allSameDieImage) {
      setTenzies(true)
    }
  }, [dice])

  function incrementTimer() {
    setTimer((prevTimer) => {
      const minutes = prevTimer.minutes
      let seconds = prevTimer.seconds

      seconds += 1
      if (seconds === 60) {
        seconds = 0
        minutes += 1
      }

      return { minutes, seconds }
    })
  }
  React.useEffect(() => {
    const interval = setInterval(incrementTimer, 1000)

    // Stop the counter if the time reaches 10 minutes
    if (tenzies === true) {
      clearInterval(interval)
    }

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [tenzies])

  function generateNewDie() {
    return {
      dieImage: `/images/dice${Math.ceil(Math.random() * 6)}.png`,
      isHeld: false,
      id: nanoid(),
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    setRollCount(rollCount + 1)

    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie()
      }),
    )
  }
  function startNewGame() {
    setRollCount(0)
    setTenzies(false)
    setDice(allNewDice())
    setTimer({ minutes: 0, seconds: 0 })
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      }),
    )
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      dieImage={die.dieImage}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <main>
      <div className="count-timer">
        <h3 className="roll-count">Roll Count: {rollCount}</h3>
        <h3 className="timer">Timer: {`${timer.minutes}:${timer.seconds}`}</h3>
      </div>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current dieImage between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      {tenzies ? (
        <button className="roll-dice" onClick={startNewGame}>
          New Game
        </button>
      ) : (
        <button className="roll-dice" onClick={rollDice}>
          Roll
        </button>
      )}
    </main>
  )
}
