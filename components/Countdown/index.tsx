import React, { useEffect, Fragment } from 'react'

type Props = {
    presaleStartTime: number
    publicStartTime: number
    countDays: number
    countHours: number
    countMinutes: number
    countSeconds: number
    setCountDays: Function
    setCountHours: Function
    setCountMinutes: Function
    setCountSeconds: Function
    setPresaleStage: Function
    setPublicStage: Function
}

const Countdown = ({ setPresaleStage, setPublicStage, presaleStartTime, publicStartTime, countDays, countHours, countMinutes, countSeconds, setCountDays, setCountHours, setCountMinutes, setCountSeconds }: Props) => {

    // const mintingStartTime = new Date(mintStartTime)
    // const mintingEndTime = new Date(mintEndTime)

    const startTimer = () => {
        // console.log(mintingStartTime.getTimezoneOffset())

        const interval = setInterval(() => {
            const now = new Date().valueOf()
            const presaleStartsIn = presaleStartTime - now
            const publicStartsIn = publicStartTime - now

            if (presaleStartsIn > 0) {
                // console.log("pre presale stage")
                const startDays = Math.floor(presaleStartsIn / 86400000)
                const startHours = Math.floor((presaleStartsIn % 86400000) / 3600000)
                const startMinutes = Math.floor((presaleStartsIn % 3600000) / 60000)
                const startSeconds = Math.floor((presaleStartsIn % 60000) / 1000)
                setCountDays(startDays)
                setCountHours(startHours)
                setCountMinutes(startMinutes)
                setCountSeconds(startSeconds)
            } else if (publicStartsIn > 0) {
                // console.log("presale stage")
                setPresaleStage(true)
                const startDays = Math.floor(publicStartsIn / 86400000)
                const startHours = Math.floor((publicStartsIn % 86400000) / 3600000)
                const startMinutes = Math.floor((publicStartsIn % 3600000) / 60000)
                const startSeconds = Math.floor((publicStartsIn % 60000) / 1000)
                setCountDays(startDays)
                setCountHours(startHours)
                setCountMinutes(startMinutes)
                setCountSeconds(startSeconds)
            } else if (presaleStartTime > 0 && publicStartTime > 0) {
                // console.log("public stage")
                setPublicStage(true)
                clearInterval(interval)
            }
        })
    }

    useEffect(() => {
        startTimer()
    }, [presaleStartTime, publicStartTime])


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