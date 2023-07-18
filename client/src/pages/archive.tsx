import { GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import Head from "next/head";
import { Channel } from "@prisma/client";
import ChannelPage from "~/components/ChannelPage";

const DEFAULT_DESC = "View archive data for a Discord channel";

export default function DefaultArchive({ channel }: Context) {
    // const [focusedChannel, setFocusedChannel] = useState(channel?.channelId);
    // const channels = api.archive.getAllChannels.useQuery({});

    return (
        <>
            <Head>
                <title>
                    {channel?.name
                        ? `Archive: ${channel.name}`
                        : `Discord Mafia Archive`}
                </title>
                <meta
                    name="description"
                    content={
                        channel
                            ? `View archive data for #${channel.name}`
                            : DEFAULT_DESC
                    }
                />
            </Head>
            <ChannelPage defaultChannelId={channel?.channelId} />
        </>
    );
}

/// Server Side Props

type Context = {
    channel?: Channel;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const rawId = ctx.query?.id;
    if (!rawId) {
        return {
            props: {} as Context,
        };
    }

    const channelId = rawId.toString();
    const channel = await prisma.channel.findUnique({
        where: {
            channelId,
        },
        select: {
            channelId: true,
            name: true,
        },
    });

    return {
        props: {
            channel: channel || undefined,
        } as Context,
    };
};
