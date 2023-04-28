import React, { useState } from "react";
import { DiscordAccount, Message } from "@prisma/client";
import Content from "./message/Content";
import Image from "next/image";

interface MessageProps {
    msg: Message & {
        author: DiscordAccount;
    };
}

function formatDate(date: Date) {
    const day = addLeadingZero(date.getDate());
    const month = addLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = addLeadingZero(date.getHours());
    const minutes = addLeadingZero(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function addLeadingZero(value: number) {
    return value.toString().padStart(2, "0");
}

const Message: React.FC<MessageProps> = ({ msg }) => {
    const [date] = useState(formatDate(msg.createdAt));
    const [avatar] = useState(
        msg.author.avatarUrl ??
            "https://cdn.discordapp.com/avatars/181373580716539904/41ed47c71315e75fca9dfcb172ba0bf5.png"
    );

    return (
        <div key={msg.messageId} className="flex flex-row p-2">
            <div className="flex-shrink p-1 pr-2">
                <Image
                    className="rounded-full"
                    src={avatar}
                    width={40}
                    height={40}
                    alt=""
                />
            </div>
            <div className="grow">
                <div className="flex flex-row items-center gap-4">
                    <span className="font-extrabold text-white">
                        {msg.author.username}
                    </span>
                    <span className="text-sm text-gray-500">{date}</span>
                </div>
                <Content text={msg.rawContent ?? ""} />
            </div>
        </div>
    );
};

export default Message;

export function MessageSkeleton() {
    return (
        <div className="flex animate-pulse flex-row p-2">
            <div className="flex-shrink p-1 pr-2 text-gray-500">
                <span className="h-10 w-10 rounded-full"></span>
            </div>
            <div className="grow">
                <div className="flex flex-row items-center gap-4">
                    <span className="flex font-extrabold text-white">
                        <span className="w-48 rounded-md bg-gray-700">{`\u200B`}</span>
                    </span>
                    <span className="flex text-sm text-gray-500">
                        <span className="w-20 rounded-md bg-gray-700">{`\u200B`}</span>
                    </span>
                </div>
                <div className="mt-4 flex">
                    <span className="h-16 w-96 rounded-md bg-gray-700">{`\u200B`}</span>
                </div>
            </div>
        </div>
    );
}
