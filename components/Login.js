
   
import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = ({providers}) => {
    return (
      <div className="flex flex-col items-center pt-48">
        <Image
          src="/images/logo.svg"
          alt="Chirp"
          width={300}
          height={300}
          objectFit="contain"
        />
        <h2 className="font-bold text-5xl text-[#FEFEFE] pb-10">Chirp</h2>
        <div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-[#999999] rounded hover:bg-white group"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#E9C46A] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                  Sign in with {provider.name}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
};

export default Login;