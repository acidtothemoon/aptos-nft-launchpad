import React, { useEffect, useState, Fragment } from 'react'

type Props = {
    mintStartTime: string
    mintEndTime: string
    countDays: number
    countHours: number
    countMinutes: number
    countSeconds: number
    setCountDays: Function
    setCountHours: Function
    setCountMinutes: Function
    setCountSeconds: Function
    countEnd: boolean
    setCountEnd: Function
}

const Countdown = ({ countEnd, setCountEnd, mintStartTime, mintEndTime, countDays, countHours, countMinutes, countSeconds, setCountDays, setCountHours, setCountMinutes, setCountSeconds }: Props) => {

    const mintingStartTime = new Date(mintStartTime)
    const mintingEndTime = new Date(mintEndTime)

    const startTimer = () => {
        // console.log(mintingStartTime.getTimezoneOffset())
        const startCountDownDate = mintingStartTime.getTime()
        const EndCountDownDate = mintingEndTime.getTime()

        const interval = setInterval(() => {
            const now = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000
            const startDistance = startCountDownDate - now
            const endDistance = EndCountDownDate - now

            if (startDistance > 0) {
                const startDays = Math.floor(startDistance / 86400000)
                const startHours = Math.floor((startDistance % 86400000) / 3600000)
                const startMinutes = Math.floor((startDistance % 3600000) / 60000)
                const startSeconds = Math.floor((startDistance % 60000) / 1000)
                setCountDays(startDays)
                setCountHours(startHours)
                setCountMinutes(startMinutes)
                setCountSeconds(startSeconds)
            } else if (endDistance > 0) {
                setCountEnd(true)
                const endDays = Math.floor(endDistance / 86400000)
                const endHours = Math.floor((endDistance % 86400000) / 3600000)
                const endMinutes = Math.floor((endDistance % 3600000) / 60000)
                const endSeconds = Math.floor((endDistance % 60000) / 1000)
                setCountDays(endDays)
                setCountHours(endHours)
                setCountMinutes(endMinutes)
                setCountSeconds(endSeconds)
            } else {
                clearInterval(interval)
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