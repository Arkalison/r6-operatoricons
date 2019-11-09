export default interface IOperator {
    /** ID of the operator.
     * @example
     * console.log(r6operators.alibi.id)
     * // alibi
     */
    id: string;

    /** Readable name of the operator.
     * @example
     * console.log(r6operators.alibi.name)
     * // Alibi
     */
    name: string;

    /** Role of the operator.
     *
     *  Possible values are `Attacker`, `Defender` or `Recruit`
     * @example
     * console.log(r6operators.alibi.role)
     * // Defender
     */
    role: "Attacker" | "Defender" | "Recruit";

    /** Shortened name of the operator's unit.
     * @example
     * console.log(r6operators.alibi.unit)
     * // GIS
     */
    unit: string;

    /** Object containing the armor & speed ratings. */
    ratings?: IRatings;
    /** Object containing metadata of the operator. */
    meta?: IMeta;
    /** Object containing biography of the operator. */
    bio?: IBio;

    /**
     * Returns the current icon as an SVG string.
     * @param userAttributes Object containing additional element attributes.
     * @returns String containing the SVG element.
     */
    toSVG(userAttributes?: {}): string;
}

interface IRatings {
    /** Armor rating as a number between 1 to 3.
     * @example
     * console.log(r6operators.alibi.ratings.armor)
     * // 1
     */
    armor: number;
    /** Speed rating as a number between 1 to 3.
     * @example
     * console.log(r6operators.alibi.ratings.speed)
     * // 3
     */
    speed: number;
}

interface IMeta {
    /** Sex of the operator.
     *
     *  Possible values are `m` or `f`.
     * @example
     * console.log(r6operators.alibi.meta.sex)
     * // f
     */
    sex: "m" | "f";

    /** Country of the operator as a ISO 3166-1 alpha-2 code (two-letter).
     * @link https://wikipedia.org/wiki/ISO_3166-1_alpha-2
     * @example
     * console.log(r6operators.alibi.meta.country)
     * // it
     */
    country: string;

    /** Season when the operator was added to the game.
     * @example
     * console.log(r6operators.alibi.meta.season)
     * // Y3S2
     */
    season: string;

    /** Height of the operator, in cm.
     * @example
     * console.log(r6operators.alibi.meta.height)
     * // 171
     */
    height: number;

    /** Weight of the operator, in kg.
     * @example
     * console.log(r6operators.alibi.meta.weight)
     * // 63
     */
    weight: number;
}

interface IBio {
    /** Real name of the operator.
     * @example
     * console.log(r6operators.alibi.bio.real_name)
     * // Aria de Luca
     */
    real_name: string;

    /** Birthday of the operator as a ISO 8601 string.
     * @link https://de.wikipedia.org/wiki/ISO_8601
     * @example
     * console.log(r6operators.alibi.bio.birthday)
     * // 1982-12-15T00:00Z
     */
    birthday: string;

    /** Birthplace of the operator, including the country.
     * @example
     * console.log(r6operators.alibi.bio.birthplace)
     * // Tripoli, Lybia
     */
    birthplace: string;
}
