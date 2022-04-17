import moment from 'moment'
moment().format()
import { useMemo, useCallback, useEffect, useRef, useState } from 'react'

const calculateDiff = (eod) => {
  let now = moment()
  return eod.diff(now)
}

export default function Countdown() {
  const eod = useMemo(() => moment().clone().endOf('day'), [])
  const [diff, setDiff] = useState(calculateDiff(eod))
  const timerRef = useRef(0)
  const timerCallback = useCallback(() => {
    setDiff(calculateDiff(eod))
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(timerCallback, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div>
      <h6 className="text-center">Next Game</h6>
      {diff < 1 ? (
        <h3 className="text-center">Available</h3>
      ) : (
        <h3 className="text-center">{moment.utc(diff).format('HH:mm:ss')}</h3>
      )}
    </div>
  )
}
