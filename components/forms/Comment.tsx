"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation, ThreadValidation } from "@/lib/validations/thread";
import * as z from "zod";

import { Input } from "../ui/input";

import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";
// import { createThread } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserID: string;
}

const Comment = ({ threadId, currentUserImg, currentUserID }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
      
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId,values.thread,JSON.parse( currentUserID),pathname);

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" comment-form"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex  w-full items-center gap-3">
              <FormLabel>
                <Image 
                 src={currentUserImg}
                 alt="profile-photo"
                 width={48}
                 height={48}
                 className="rounded-full object-contain"
                 />
              </FormLabel>
              <FormControl className=" border-none bg-transparent">
                <Input 
                type="text"
                placeholder="Comments..."
                className="no-focus text-light-1 outline-none"
                 {...field} />
              </FormControl>

           
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
