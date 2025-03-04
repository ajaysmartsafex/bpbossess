import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { rehydrateUser } from "../store/authSlice"; // Import the rehydrate action

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (!userData) {
            const storedUser = JSON.parse(localStorage.getItem("persist:root"));
            if (storedUser) {
                const parsedUserData = JSON.parse(storedUser.auth).userData;
                if (parsedUserData) {
                    dispatch(rehydrateUser({ userData: parsedUserData }));
                }
            }
        }
    }, [userData, dispatch]);

    const isAuthor = post && userData ? post.userId === userData.$id : false;
    useEffect(() => {
        if (slug) {
            appwriteService.getGame(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deleteGame = () => {
        appwriteService.deleteGame(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };


    const formatEndTime = (endtime) => {
        if (!endtime) {
            return "No time available";
        }

        const date = new Date(endtime);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...options });
    };


    const formatStartTime = (starttime) => {
        if (!starttime) {
            return "No time available";
        }

        const date = new Date(starttime);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...options });
    };

    return post ? (
        <div className="py-8">
            <Container>

                <div className="flex px-3 py-3 gap-3">
                    <div className="flex-col w-full justify-center mb-4 border rounded-xl p-2">
                        <div className="w-full mb-6">
                            <h1 className="text-2xl font-bold">{post.title}</h1>
                        </div>
                        <h2 className='text-xl font-bold text-black'>Game Number</h2>
                        <div className="w-full mb-6">
                            <h1 className="text-2xl font-bold">{post.gamenumber}</h1>
                        </div>
                        <h2 className='text-xl font-bold text-black'>Game Time</h2>
                        <div className='game_time'>
                            <span className='start_time'>{formatStartTime(post.starttime)}</span>
                            <span className='end_time'>{formatEndTime(post.endtime)}</span>
                        </div>
                        <h2 className='text-xl font-bold text-black'>Game Owner</h2>
                        <div className="browser-css">
                            {parse(post.content)}
                        </div>
                        <h2 className='text-xl font-bold red_text'>Game Result</h2>
                        <div className="final_resule">
                            <span className='lrnumber text-black'>{post.lrnumber}</span>
                            <span className='mrnumber px-2'>{post.mrnumber}</span>
                            <span className='rrnumber text-black'>{post.rrnumber}</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-center mb-4 border rounded-xl p-2">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="icon_img rounded-xl"
                        />

                        {/* Ensure isAuthor is correctly set before showing buttons */}

                        {isAuthor && (
                            <div className="edit_delete_cont justify-start mt-20">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500" className="mr-3">
                                        Edit
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-500" onClick={deleteGame}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </Container>
        </div>
    ) : null;
}
