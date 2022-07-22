import React, { useState, useEffect } from "react";
import styles from '../styles/Comments.module.css'
import CommentCard from "./CommentCard";

const Comments = ({
    address,
    onHide,
    createComment,
    index,
    getComments,
    commentCount,
}) => {

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    useEffect(()=> {
        gettingComments()
    }, [index])

    const gettingComments = async () => {
        let comments = await getComments(address, commentCount)
        comments.sort((a,b) => b.videoTime.toNumber() - a.videoTime.toNumber())
        setComments(comments)
    }

    const replyClicked = async () => {
        await createComment(address, commentCount, newComment)
        setComments('')
    }

    return (
        <div className={styles.wrapper}>
            <div className={style.commentsHeader}>
                <p>{commentCount}</p>
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
            <div className={styles.commentInputWrapper}>
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

export default Comments;