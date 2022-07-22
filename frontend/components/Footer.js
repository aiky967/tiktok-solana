import React from 'react'
import styles from '../styles/Footer.module.css'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import Image from 'next/image'

const Footer = ({channel, description, song}) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerText}>
        <h3>@{channel}</h3>
        <p>{description}</p>
        <div className={styles.footerTicker}>
            <MusicNoteIcon className={styles.footerIcon} />
            <p>&nbsp; &nbsp; &nbsp; {song}</p>
        </div>
      </div>
      <div className={styles.footerRecord}>
        <Image 
            src={'https://static.thenounproject.com/png/934821-200.png'}
            alt = 'vinyl record'
            width = {50}
            height = {50}  
        />
      </div>
    </div>
  )
}

export default Footer
