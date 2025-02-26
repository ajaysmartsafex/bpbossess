import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";


export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            gamenumber: post?.gamenumber || "",
            slug: post?.$id || "",
            content: post?.content || "",
            starttime: post?.starttime || "",
            endtime: post?.endtime || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);


    const submit = async (data) => {

        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updateGame(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createGame({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const formatInput = (value) => {
        if (!value || typeof value !== "string") return "";

        // Remove non-numeric characters
        const digits = value.replace(/\D/g, "").slice(0, 8); // Max 8 characters

        // Format: 3-2-3 pattern
        let formatted = "";
        for (let i = 0; i < digits.length; i++) {
            if (i === 3 || i === 5) {
                formatted += "-";
            }
            formatted += digits[i];
        }

        // Add "*" if length is less than 8
        while (formatted.replace(/-/g, "").length < 8) {
            formatted += "*";
        }

        return formatted;
    };

    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "").slice(0, 8); // Keep only numbers, max 8
        const formattedValue = formatInput(rawValue); // Format the value
        setValue("gamenumber", formattedValue, { shouldValidate: true }); // Save formatted value in `gamenumber`
    };

    // Handle start time input change
    const handleStartTimeChange = (e) => {
        if (isValidTime) {
            const value = e.target.value;
            setValue("startTime", value);
        }
    };

    // Handle end time input change
    const handleEndTimeChange = (e) => {
        if (isValidTime) {
            const value = e.target.value;
            setValue("endTime", value);
        }
    };

    // Simple time validation (ensures the format is HH:MM)
    const isValidTime = (time) => {
        const timePattern = /^([1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/;
        return timePattern.test(time);
    };


    const resultValue = watch("gamenumber", "");

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />

                <Input
                    label="Game Number :"
                    placeholder="Enter 8-digit number"
                    className="mb-4"
                    {...register("gamenumber", { required: true })}
                    value={resultValue}
                    onChange={handleInputChange} // Apply formatting dynamically
                    maxLength={10} // Allows space for dashes
                />

                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Dpbossess :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}

                <div className="game_time_section">
                    <Input
                        label="Start Time :"
                        // type="time"
                        placeholder="Enter game start time"
                        className="mb-4 mr-2"
                        defaultValue=""
                        format="hh:mm a"
                        {...register("starttime", { required: true })}
                        onChange={handleStartTimeChange}
                    />
                    <Input
                        label="End Time :"
                        // type="time"
                        placeholder="Enter game end time"
                        className="mb-4"
                        defaultValue=""
                        format="hh:mm a"
                        {...register("endtime", { required: true })}
                        onChange={handleEndTimeChange}
                    />
                </div>
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}