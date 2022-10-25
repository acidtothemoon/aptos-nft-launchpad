import React, { useEffect, useState, Fragment } from 'react'

type Props = { mintStartTime: Date }

const Countdown = ({ mintStartTime }: Props) => {

    const [countDays, setCountDays] = useState<number>(0)
    const [countHours, setCountHours] = useState<number>(0)
    const [countMinutes, setCountMinutes] = useState<number>(0)
    const [countSeconds, setCountSeconds] = useState<number>(0)

    const mintingStartTime = new Date(mintStartTime)

    const startTimer = () => {
        const countDownDate = mintingStartTime.getTime()

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = countDownDate - now
            const days = Math.floor(distance / 86400000)
            const hours = Math.floor((distance % 86400000) / 3600000)
            const minutes = Math.floor((distance % 3600000) / 60000)
            const seconds = Math.floor((distance % 60000) / 1000)

            if (distance < 0) {
                clearInterval(interval)
            } else {
                setCountDays(days)
                setCountHours(hours)
                setCountMinutes(minutes)
                setCountSeconds(seconds)
            }
        })
    }

    useEffect(() => {
        startTimer()
    }, [])


    return (
        <Fragment>
            <section className='count-container'>
                {/* <div>{mintStartTime}</div> */}
                <section className=''>
                    <div className='flex text-[#4df1c0] m-auto items-center text-center h-[150px] w-[300px]
                    sm:h-[180px] sm:w-[350px] bg-gradient-to-r from-[#051818] to-[#0e3839]
                    rounded-xl border-2 border-silver shadow-2xl shadow-[#54bfd4] justify-around px-4 '>
                        <section>
                            <p className='text-5xl'>{countDays}</p>
                            <small>Days</small>
                        </section>
                        <span>:</span>
                        <section>
                            <p className='text-5xl'>{countHours}</p>
                            <small>Hours</small>
                        </section>
                        <span>:</span>
                        <section>
                            <p className='text-5xl'>{countMinutes}</p>
                            <small>Minutes</small>
                        </section>
                        <span>:</span>
                        <section>
                            <p className='text-5xl'>{countSeconds}</p>
                            <small>Seconds</small>
                        </section>
                    </div>
                </section>
            </section>
        </Fragment>
    )
}



export default Countdown