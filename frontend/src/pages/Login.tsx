import { useState, FormEvent } from "react"
import { ResquestToAPI } from "../consts"
import { UserData } from "../consts/api"
import { useNavigate } from "react-router-dom"

const InputField = ({ text, type, required, fn, id }: { text: string, type: string, required: boolean, fn: (e: string) => void, id: string }) => {
    return (
        <label className="flex gap-2 flex-col" htmlFor={id}>
            <span className="dark:text-slate-300 font-semibold text-zinc-900">
                {text}
            </span>
            <input
                id={id}
                name={id}
                onChange={(e) => fn(e.target.value)}
                type={type}
                maxLength={50}
                spellCheck={false}
                required={required}
                className="bg-transparent border-zinc-300 dark:border-slate-300 border rounded dark:text-slate-200 text-zinc-800 p-2"
            />
        </label>
    )
}

const LoginButton = ({ loading }: { loading: boolean }) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        Login
        </button>
    )
}

const RequestLogin = async ({ username, password }: { username: string, password: string }) => {
    try {
        const response = await ResquestToAPI<UserData>(
            "login",
            "POST",
            JSON.stringify({ user_id: username, password }),
        );
        return response;
    } catch (e) {
        console.error("RequestLogin: ", e);
    }
}

const Login = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>("");
    const navigate = useNavigate();

    const SubmitForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(void 0);
        try {
            const response = await RequestLogin({ username, password });
            if (response) {
                if (!response.success || !response.data) {
                    setError(response.msg);
                } else {
                    navigate("/reports");
                }
            } else {
                setError("Server down!");
            }
        } catch (error) {
            console.error(error);
            setError("SubmitForm Error!");
        } finally {
            setLoading(false);
        }
    }

    const FillUsername = (e: string) => setUsername(e);
    const FillPassword = (e: string) => setPassword(e);

    return (
        <div className="dark:bg-zinc-900 bg-white h-screen w-screen flex items-center">
            <div className="container mx-auto">
                <section className="p-4 flex w-80 justify-center flex-col gap-4 mx-auto">
                    <img src="/vite.svg" alt="" className="self-center w-10 h-10" />
                    <h1 className="dark:text-white text-center text-lg font-semibold text-zinc-900">
                        Login - Interview Code Problem
                    </h1>
                    <form onSubmit={SubmitForm} className="flex flex-col gap-4">
                        <div className="w-full flex flex-col gap-2">
                            {InputField({ text: "User ID", type: "text", required: true, fn: FillUsername, id: "username" })}
                            {InputField({ text: "Password", type: "password", required: false, fn: FillPassword, id: "password" })}
                        </div>
                        <LoginButton loading={loading} />
                        {error && (
                            <div className="text-red-400 font-semibold">{error}</div>
                        )}
                    </form>
                </section>
            </div>
        </div>
    )
}
export default Login;