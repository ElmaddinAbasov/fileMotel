"use strict"
import * as fs from 'node:fs/promises'
import postgres from 'postgres'

class fileMotel
{
	#start;
	#sql;
	#file_id;
	constructor()
	{
		this.#start = '.';
		this.#sql = postgres({
        		host: 'localhost',
        		port: 5432,
        		database: 'motel',
        		username: 'gacy',
        		password: 'gacy1996',
		});
		this.#file_id = 0;
	}
	async fileMotelOpenDir()
	{
		try
		{
			return await fs.opendir(this.#start);
		}
		catch (err)
		{
			console.error(err);
		}
	}
        async #saveDataInMotel(file_id, file_name, file_version)
        {
                try
                {
                        await this.#sql`
                        INSERT INTO files (file_id, file_name, file_version)
                        VALUES (${file_id, file_name, file_version});`;
                }
                catch (err)
                {
                        console.error(err);
                }
        }	
        async #getData(name)
        {
                console.log(name);
                try {
                        const stats = await fs.stat(name);
                        console.log(`File ${name} access time: ${stats.atime}`);
			this.#saveDataInMotel(this.#file_id, name, stats.atime);
			this.#file_id += 1;
                } catch (error) {
                        console.error(`Error getting file stats: ${error.message}`);
                }
        }	
	async fileMotelReadDir(dir)
	{
		let stats;
		for (;;)
		{
			await dir.read((err, dirent) => {
				if (err)
				{
					console.error(err);
					dir.close(() => {});
					return;
				}
				if (dirent === null)
					return;
				this.#getData(dirent.name);
				this.fileMotelReadDir(dir);
			});
			break;
		}
	}
	async fileMotelCloseDir(dir)
	{
		await dir.close(() => {console.log('fileMotelCloseDir:Success')})
	}
	async clean()
	{
		await this.#sql.end();
	}
}

const fMotel = new fileMotel();
const dir = await fMotel.fileMotelOpenDir();
await fMotel.fileMotelReadDir(dir);
fMotel.clean();

