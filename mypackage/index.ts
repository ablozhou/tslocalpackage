
export class Hello {
	greeting:string;
	constructor(message:string){
		this.greeting=message;
	}
	greet(name: string){
		let say=`Hello ${name}, ${this.greeting}!`;
		console.log(say);
		return say;
	}
}
