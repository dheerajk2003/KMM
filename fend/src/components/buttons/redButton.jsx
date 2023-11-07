export default function RedButton(props){
    return(
        <button className="w-auto text-white bg-rose-600 hover:shadow-lg transition-all duration-200 hover:shadow-rose-400 active:scale-105 focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 text-center " 
        onClick={props.func}>{props.name}
        </button>
    );
}

export function RedSmallButton(props){
    return(
        <button className="w-auto text-white bg-rose-600 hover:shadow-md transition-all duration-100 hover:shadow-rose-400 active:scale-105 focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-4 py-1 text-center " 
        onClick={props.func}>{props.name}
        </button>
    )
}