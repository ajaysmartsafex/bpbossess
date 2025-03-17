import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
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
    if (data.starttime) {
      data.starttime = convertToISODate(data.starttime);
    }
    if (data.endtime) {
      data.endtime = convertToISODate(data.endtime);
    }

    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

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
        const dbPost = await appwriteService.createGame({
          ...data,
          userId: userData.$id,
        });

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
    if (!value || typeof value !== "string") return "********";

    const digits = value.replace(/\D/g, "").slice(0, 8); // Max 8 characters

    let formatted = "";
    for (let i = 0; i < digits.length; i++) {
      if (i === 3 || i === 5) {
        formatted += "-";
      }
      formatted += digits[i];
    }

    while (formatted.replace(/-/g, "").length < 8) {
      formatted += "*";
    }

    return formatted;
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const cleanedValue = rawValue.replace(/\D/g, "");
    const digitsOnly = cleanedValue.slice(0, 8);
    const formattedValue = formatInput(digitsOnly);
    setValue("gamenumber", formattedValue, { shouldValidate: true });
    setTimeout(() => {
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const isValidTime = (time) => {
    const timePattern = /^([1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/;
    return timePattern.test(time);
  };

  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    if (isValidTime(value)) {
      setValue("starttime", value);
    }
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    if (isValidTime(value)) {
      setValue("endtime", value);
    }
  };

  const convertToISODate = (timeString) => {
    const date = new Date();
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);

    return date.toISOString();
  };

  const resultValue = watch("gamenumber", "");

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div className="w-full">
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
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />

        <Input
          label="Game Number :"
          placeholder="Enter 8-digit number"
          className="mb-4"
          type="text"
          {...register("gamenumber", { required: true })}
          value={resultValue}
          onChange={handleInputChange}
          maxLength={12}
        />

        <Input
          label="Game Owner :"
          placeholder="create by"
          className="mb-4"
          type="text"
          {...register("content", { required: true })}
        />

        {/* <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} /> */}
      </div>
      <div className="w-full">
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg w-28 h-28"
            />
          </div>
        )}
        <Input
          label="Game Icon :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        <div className="game_time_section gap-2">
          <Input
            type="text"
            label="Start Time:"
            placeholder="00:00 AM/PM"
            className="mb-4"
            {...register("starttime", { required: true })}
            onChange={handleStartTimeChange}
          />
          <Input
            type="text"
            label="End Time:"
            placeholder="00:00 AM/PM"
            className="mb-4"
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
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
