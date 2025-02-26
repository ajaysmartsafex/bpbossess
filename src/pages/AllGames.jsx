import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';

function AllGames() {
    const [posts, setPosts] = useState([]);

    const results = useSelector(state => state.result.results);
    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        appwriteService.getGames([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents);
            }
        });
    }, []);

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => {
                        const gameResult = results.find(item =>
                            item.date === currentDate && item.gameName === post.title
                        );


                        return (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard
                                    {...post}
                                    gameName={post.title}
                                    gameResult={gameResult}
                                    currentDate={currentDate}
                                />
                            </div>
                        );
                    })}


                </div>
            </Container>
        </div>
    );
}

export default AllGames;
