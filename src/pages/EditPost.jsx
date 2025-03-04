import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';

// Function to format the `starttime` and `endtime` (convert from UTC to IST and format it)
const formatTime = (time) => {
    if (!time) {
        return ""; // Return empty if no time is available
    }

    const date = new Date(time); // Converts from UTC to local time (browser's local time by default)
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Display AM/PM format
    };

    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...options });
};

function EditPost() {

    const [post, setPosts] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getGame(slug).then((post) => {
                if (post) {
                    const formattedPost = {
                        ...post,
                        starttime: formatTime(post.starttime),
                        endtime: formatTime(post.endtime),
                    };
                    setPosts(formattedPost)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])


    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost