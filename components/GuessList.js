import React from 'react'
import { Stack, Card } from 'react-bootstrap'

function getCardBg(guess, answer) {
  if (!guess) return ''
  else if (guess === 'Skipped') return 'secondary'
  else if (answer.romaji === guess.romaji) return 'success'
  else return 'danger'
}

const Guess = ({ guess, answer, border }) => {
  return (
    <Card bg={getCardBg(guess, answer)} border={border}>
      <Card.Body style={{ padding: '.25rem' }}>
        <div>{guess && guess.romaji}&nbsp;</div>
        <div>
          <small>{guess && guess.english}</small>
        </div>
      </Card.Body>
    </Card>
  )
}

export default class GuessList extends React.Component {
  generateCards = (guesses, answer) => {
    let cards = []
    for (let i = 0; i < 6; i++) {
      cards.push(
        <Guess
          key={i}
          guess={guesses[i]}
          answer={answer}
          border={
            i === guesses.length && guesses[guesses.length - 1] !== answer
              ? 'light'
              : null
          }
        />
      )
    }
    return cards
  }

  render() {
    return (
      <Stack gap={2}>
        {this.generateCards(this.props.guesses, this.props.answer)}
      </Stack>
    )
  }
}
