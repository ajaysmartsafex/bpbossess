import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from "../index";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import appwriteResult from "../../appwrite/result";
import appwriteService from "../../appwrite/config";
import { useDispatch, useSelector } from 'react-redux';
import { setResults, addResult, updateResult, setGames } from '../../store/resultSlice';

const ResultForm = (result) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const games = useSelector(state => state.result.games);
    const results = useSelector(state => state.result.results);

    const [allData, setAllData] = useState(null);
    const formatDate = (date) => date.toISOString().split("T")[0];

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            title: result?.title || "",
            gameName: result?.gameName || "",
            date: result?.date ? new Date(results.date) : new Date(),
            firstD: result?.firstD || "*",
            secondD: result?.secondD || "*",
            thirdD: result?.thirdD || "*",
            fourD: result?.fourD || "*",
            fiveD: result?.fiveD || "*",
            sixD: result?.sixD || "*",
            seveenD: result?.seveenD || "*",
            eightD: result?.eightD || "*",
        },
    });

    const gameName = watch("gameName");
    const date = formatDate(selectedDate);


    useEffect(() => {
        const mergedData = async () => {
            try {
                const [gameData, resultData] = await Promise.all([
                    appwriteService.getGames(),
                    appwriteResult.getResults()
                ]);

                const resultsArray = resultData?.documents || [];
                const gamesArray = gameData?.documents || [];

                dispatch(setResults(resultsArray));
                dispatch(setGames(gamesArray));

                setAllData({ formattedGames: gamesArray, formattedResults: resultsArray });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        mergedData();
    }, [dispatch]);

    useEffect(() => {
        if (gameName && date) {
            const existingResult = results.find(r => r.gameName === gameName && r.date === date);
            if (existingResult) {
                Object.keys(existingResult).forEach(key => {
                    if (key.endsWith('D')) setValue(key, existingResult[key] || '*');
                });
            }
        }
    }, [gameName, date, results, setValue]);


    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, [])


    const submit = async (data) => {
        const formattedData = {
            ...data,
            date,
            firstD: data.firstD || "*",
            secondD: data.secondD || "*",
            thirdD: data.thirdD || "*",
            fourD: data.fourD || "*",
            fiveD: data.fiveD || "*",
            sixD: data.sixD || "*",
            seveenD: data.seveenD || "*",
            eightD: data.eightD || "*"
        };

        try {
            const dbResult = await appwriteResult.createOrUpdateResult(formattedData);

            if (dbResult) {
                if (result?.gameId) {
                    dispatch(updateResult(dbResult));
                } else {
                    dispatch(addResult(dbResult));
                }

                navigate(`/result/${slugTransform(dbResult.gameName)}`);
            }
        } catch (error) {
            console.error("Error saving result:", error);
        }
    };


    return (
        <div className='flex items-center justify-center w-full py-8'>
            <div className='mx-auto w-full max-w-xl bg-gray-100 rounded-xl p-10 border border-black/10'>
                <h2 className="text-center text-2xl font-bold leading-tight">Update Your Existing Result</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t want Edit in Result ?&nbsp;
                    <Link className="font-medium text-primary transition-all duration-200 hover:underline">
                        Go to Add Result link
                    </Link>
                </p>

                <form onSubmit={handleSubmit(submit)} className='mt-8'>
                    <div className='space-y-5'>
                        <h4 className='select_game text-left'>Select Game</h4>
                        <Select
                            options={allData?.formattedGames?.map(game => game.title) || []}
                            label="Status"
                            className="mb-4 mt-0"
                            {...register("gameName", { required: true })}
                        />
                        <div className="date_cont w-full">
                            <label className="block text-sm font-medium text-gray-700">Game Date:</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                maxDate={new Date()}
                                showYearDropdown
                                dateFormat="yyyy-MM-dd"
                                className="border rounded p-2 w-full"
                            />
                        </div>

                        <div className='edit_result_section gap-2'>
                            {["firstD", "secondD", "thirdD", "fourD", "fiveD", "sixD", "seveenD", "eightD"].map((field, index) => (
                                <Input key={index} type="text" maxLength={1} placeholder={field.toUpperCase()} {...register(field)} />
                            ))}
                        </div>

                        <Button type="submit" className="w-full">Edit Result</Button>
                    </div>
                </form>
            </div>
        </div>
    )


}

export default ResultForm


