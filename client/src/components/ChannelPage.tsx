import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import Channel from "./Channel";

type ChannelArchiveProps = {
    defaultChannelId?: string;
};

export default function ChannelPage({ defaultChannelId }: ChannelArchiveProps) {
    const router = useRouter();
    const [focusedChannel, setFocusedChannel] = useState(defaultChannelId);
    const channels = api.archive.getAllChannels.useQuery({});

    const newChannel = (id: string) => {
        setFocusedChannel(id);
        router.query["id"] = focusedChannel;
    };

    return (
        <>
            <main className="flex h-screen flex-row bg-neutral-900 bg-polygon p-8 text-white">
                <div className="w-96 bg-discord-darker">
                    {channels.isLoading
                        ? "Loading..."
                        : channels.data?.map((v) => {
                              return (
                                  <div
                                      className={`py-2 pl-2 text-base hover:cursor-pointer hover:bg-gray-600 ${
                                          focusedChannel === v.channelId
                                              ? "bg-gray-400"
                                              : ""
                                      }`}
                                      key={v.channelId}
                                      onClick={() => {
                                          newChannel(v.channelId);
                                      }}
                                  >
                                      #{v.name}
                                  </div>
                              );
                          }) ?? "No channels found"}
                </div>
                <Channel channelId={focusedChannel} />
            </main>
        </>
    );
}
