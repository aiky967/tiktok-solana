import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils.js/const";
import { getProgramInstance } from "../utils.js/utils";

const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const { BN, web3 } = anchor
const { SystemProgram } = web3

const defaultAccounts = {
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram: SystemProgram.programId
}

const useTikok = (
    setTikToks,
    userDetail,
    videoUrl,
    description,
    setDescription,
    setVideoUrl,
    setNewVideoShow,
) => {
    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance(connection, wallet)
    const getTiktoks = async () => {
        console.log('fetching')

        const videos = await program.account.videoAccount.all()
        console.log(videos)

        setTikToks(videos)
    }

    const likeVideo = async address => {
        console.log('video liked!')
        const tx = await program.rpc.likevideo({
            accounts: {
                video: new PublicKey(address),
                authority: wallet.publicKey,
                ...defaultAccounts,
            },
        })
        console.log(tx)  
    }

    const createComment = async(address, count, comment) => {
        let [comment_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('comment'),
            new PublicKey(address).toBuffer(),
            new BN(count).toArray(Buffer, 'be', 8),
        ],
        program.programId,
        )

        if(userDetail) {
            const tx = await program.rpc.createComment(
                comment,
                userDetail.userName,
                userDetail.userProfileImageUrl,
                {
                    accounts: {
                        video: new PublicKey(address),
                        comment: comment_pda,
                        authority: wallet.publicKey,
                        ...defaultAccounts,
                    },
                },
            )
            console.log(tx)
        }
    }

    const newVideo = async () => {
        const randomKey = anchor.web3.Keypair.generate().publicKey;

        let [video_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('video'), randomKey.toBuffer()],
            program.programId,
        )

        const tx = await program.pc.createVideo(
            description,
            videoUrl,
            userDetail.userName,
            userDetail.userProfileImageUrl,
            {
                accounts: {
                    video: video_pda,
                    randomKey: randomKey,
                    authority: wallet.publicKey,
                    ...defaultAccounts
                }
            }
        )

        console.log(tx)
        setDescription('')
        setVideoUrl('')
        setNewVideoShow(false)

    }

    const getComments = async (address, count) => {
        let commentSigners = []

        for(let i = 0; i < count; i++) {
            let [commentSigner] = await useAnchorWallet.web3.PublicKey.findProgramAddress(
                [
                    utf8.encode('comment'),
                    new PublicKey(address).toBuffer(),
                    new BN(i).toArrayLike(Buffer, 'be', 8)
                ],
                program.programId,
            )

            commentSigners.push(commentSigner)
        }

        const comments = await program.account.commentAccount.fetchMultiple(
            commentSigners,
        )
        console.log(comments)
        return comments
    }
    return { getTiktoks, likeVideo, createComment, newVideo, getComments }
} 

export default useTikok;