import { useState, useEffect } from 'react'
import CommentCard from './commentsCard'
import style from '../styles/Comments.module.css'

const Comments = ({
  onHide,
  createComment,
  address,
  getComments,
  commentCount,
}) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  console.log(comments, '🔥')

  useEffect(() => {
    gettingComments()
  }, [address])

  const gettingComments = async () => {
    let comments = await getComments(address, commentCount)
    comments.sort((a, b) => b.videoTime.toNumber() - a.videoTime.toNumber())
    setComments(comments)
  }

  const replyClicked = async () => {
    await createComment(address, commentCount, newComment)
    setNewComment('')
  }

  return (
    <div className={style.wrapper}>
      <div className={style.commentsHeader}>
        <p>{commentCount} comments</p>
        <p className={style.closeButton} onClick={onHide}>
          &times;
        </p>
      </div>
      {comments.map(comment => {
        return (
          <CommentCard
            key={comment.index.toNumber()}
            username={comment.commenterName}
            comment={comment.text}
            avatar={comment.commenterUrl}
            timestamp={comment.videoTime.toNumber()}
          />
        )
      })}

      <div className={style.commentInputWrapper}>
        <input
          type='text'
          onChange={e => setNewComment(e.target.value)}
          value={newComment}
          placeholder='Leave a comment...'
        />
        <button className={style.button} onClick={replyClicked}>
          Reply
        </button>
      </div>
    </div>
  )
}

export default Comments