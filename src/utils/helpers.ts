import { Noun } from "../../generated/schema";

export function findOrCreateNoun(nounId: string): Noun {
    let noun = Noun.load(nounId);
    if (noun === null) {
        noun = new Noun(nounId);
        noun.save();
    }
    return noun;
}
