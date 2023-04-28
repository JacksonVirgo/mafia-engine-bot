import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Mafia Engine</title>
                <meta name="description" content="bitch" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="p-1/4 flex h-screen w-screen flex-row items-center justify-center bg-neutral-900 bg-polygon">
                <section className="absolute top-1/2 flex h-3/4 w-3/4 grow -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-2 border-black bg-zinc-800 text-white">
                    <div className="absolute left-0 top-0 m-4"></div>
                    <h1 className="text-5xl font-extrabold leading-normal  text-white md:text-[5rem]">
                        <span className="text-red-400">Mafia</span> Engine
                    </h1>
                    <p className="ext-white text-2xl">What do you need?</p>
                    <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-3 lg:w-2/3">
                        <CommunityCard
                            name="Wiki"
                            description="View our wikipedia outlining our roles and setups."
                            url="https://discord-mafia-role-cards.fandom.com/wiki/Discord_Mafia_Role_cards_Wiki"
                        />
                        <CommunityCard
                            name="Archives"
                            description="Read all of our archived games, which you cannot see on our server anymore."
                            url="/archive"
                        />
                        <CommunityCard
                            name="Articles"
                            description="Create or read articles from fellow members of our community"
                            url="https://discord-mafia-role-cards.fandom.com/wiki/Mafia_Guides"
                        />
                    </div>
                    <div className="mt-10  leading-normal text-white">
                        Looking for{" "}
                        <span className="text-red-400 underline hover:cursor-pointer">
                            another community?
                        </span>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;

type CommunityCardProps = {
    name: string;
    description: string;
    url: string;
};

const CommunityCard = ({ name, description, url }: CommunityCardProps) => {
    return (
        <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
            <h2 className="text-lg text-gray-100">{name}</h2>
            <p className="text-sm text-white">{description}</p>
            <a
                className="mt-3 text-sm text-red-400 underline decoration-dotted underline-offset-2"
                href={url}
            >
                View {name}
            </a>
        </section>
    );
};
