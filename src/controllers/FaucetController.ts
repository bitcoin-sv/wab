/**
 * FaucetController
 *
 * Provides an endpoint to request faucet payment for a user, returning existing
 * payment data if it already exists, or creating a new payment if it doesn't.
 */

import { Request, Response } from "express";
import { UserService } from "../services/UserService";
const COMMISSION_FEE = process.env.COMMISSION_FEE

export class FaucetController {
    /**
     * Request faucet. Body must include { presentationKey }.
     * Return the payment data if new or existing. Only one payment is made per user.
     */
    public static async requestFaucet(req: Request, res: Response) {
        try {
            const faucetEnabled = true; // Hardcoded for demonstration
            const faucetAmount = Number(COMMISSION_FEE) || 1000;  // Hardcoded for demonstration

            if (!faucetEnabled) {
                return res.status(403).json({ message: "Faucet is disabled." });
            }

            const { presentationKey } = req.body;
            if (!presentationKey) {
                return res.status(400).json({ message: "presentationKey is required" });
            }

            const user = await UserService.getUserByPresentationKey(presentationKey);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const payment = await UserService.getOrCreateFaucetPayment(user.id, faucetAmount);
            res.json({
                success: true,
                paymentData: {
                    amount: payment.amount,
                    txid: payment.txid,
                    outputIndex: payment.outputIndex,
                    k: payment.k,
                    tx: [...payment.beef]
                }
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
}
