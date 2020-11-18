"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('repo-token', { required: true });
            const baseVersion = core.getInput('base_version');
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1); // getMonth() is zero-based
            const dd = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
            const hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
            const min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            const ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
            const timestamp = [yyyy, mm, dd, hh, min, ss].join("");
            const tag = `${baseVersion}.${timestamp}`;
            const sha = github.context.sha;
            console.log(`Generating a tag with ${tag} for ${sha}.`);
            const client = new github.GitHub(token);
            yield client.git.createRef({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                ref: `refs/tags/${tag}`,
                sha: sha
            });
            // create the output variables
            core.setOutput('tag_name', tag);
            core.setOutput('tag_hash', sha);
            core.setOutput('tag_time', timestamp);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
