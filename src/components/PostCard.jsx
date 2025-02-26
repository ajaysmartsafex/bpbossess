import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import parse from "html-react-parser";

function PostCard({ $id, featuredImage, title, gamenumber, starttime, endtime, content, gameResult, currentDate, gameName }) {
  const displayNumbers = gameResult
    ? [gameResult.firstD, gameResult.secondD, gameResult.thirdD, gameResult.fourD,
    gameResult.fiveD, gameResult.sixD, gameResult.seveenD, gameResult.eightD]
      .map(num => num || '★')
      .join('')
    : '★★★★★★★★';

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full h-full bg-gray-100 rounded-xl p-4'>
        <div className='flex w-full justify-center mb-4 post-image'>
          <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl' />
        </div>
        <h1 className='game_name_color text-xl font-bold'>{title}</h1>
        <h2 className='text-xl font-bold text-black mt-2'>Game Number</h2>
        <h2 className='game_number_color text-xl font-bold'>{gamenumber}</h2>
        <h2 className='text-xl font-bold text-black mt-2'>Game Time</h2>
        <div className='game_time'>
          <span className='start_time'>{starttime}</span>
          <span className='end_time'>{endtime}</span>
        </div>
        <h2 className='result_number text-xl font-bold red_text mt-2'>Result: {gameResult ? currentDate : 'No result'}</h2>
        <div className='final_result'>
          <span className='lrnumber red_text'>{displayNumbers}</span>
        </div>
        <h2 className='text-xl font-bold text-black mt-2'>Game Owner</h2>
        <div className='browser-css'>
          {parse(content)}
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
