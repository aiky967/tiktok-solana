import { useRef, useState } from 'react'
import Comments from './comments'
import Footer from './footer'
import Sidebar from './sidebar'
import style from '../styles/Video.module.css'

const Video = ({
  address,
  url,
  channel,
  description,
  index,
  likes,
  shares,
  likeVideo,
  likesAddress,
  createComment,
  getComments,
  commentCount,
}) => {
  const [playing, setPlaying] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const videoRef = useRef(null)

  const onVideoPress = () => {
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const hideComments = () => {
    setShowCommentsModal(false)
  }

  const showComments = () => {
    setShowCommentsModal(true)
  }

  return (
    <div className={style.wrapper}>
      <video
        className={style.videoPlayer}
        loop
        onClick={onVideoPress}
        ref={videoRef}
        src={url}
        style={{ objectFit: 'cover' }}
      />

      <Footer channel={channel} description={description} song={index} />

      <Sidebar
        address={address}
        likes={likes}
        shares={shares}
        onShowComments={showComments}
        likeVideo={likeVideo}
        likesAddress={likesAddress}
        messages={commentCount}
      />
      {showCommentsModal && (
        <Comments
          onHide={hideComments}
          index={index}
          address={address}
          createComment={createComment}
          getComments={getComments}
          commentCount={commentCount}
        />
      )}
    </div>
  )
}

export default Video