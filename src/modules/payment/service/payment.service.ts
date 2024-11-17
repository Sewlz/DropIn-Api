import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { BookingService } from '../../booking/service/booking.service';
@Injectable()
export class PaymentService {
  private readonly client: paypal.core.PayPalHttpClient;
  constructor(
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
  ) {
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET,
    );
    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(bookingId: string, amount: number) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toString(),
          },
        },
      ],
      application_context: {
        return_url: `http://localhost:3000/payment/result?bookingId=${bookingId}`,
        cancel_url: 'http://localhost:3000/payment/cancel',
      },
    });

    try {
      const response = await this.client.execute(request);
      const approvalUrl = response.result.links.find(
        (link) => link.rel === 'approve',
      )?.href;

      if (!approvalUrl) {
        throw new Error('Approval URL not found in PayPal response');
      }
      return {
        orderId: response.result.id,
        approvalUrl,
      };
    } catch (error) {
      throw new Error(`PayPal Order Creation Error: ${error.message}`);
    }
  }

  async refundPayment(captured: string, amount: number) {
    const request = new paypal.payments.CapturesRefundRequest(captured);
    request.requestBody({
      amount: {
        value: amount.toFixed(2),
        currency_code: 'USD',
      },
      invoice_id: `INVOICE-${captured}`,
      note_to_payer: 'Refunding your payment.',
    });

    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      if (error.statusCode === 404) {
        throw new Error('Payment not found or already refunded');
      }
      if (error.statusCode === 422) {
        throw new Error('Refund amount exceeds captured amount');
      }
      throw new Error(`PayPal refund failed: ${error.message}`);
    }
  }

  async captureOrder(token: string) {
    const request = new paypal.orders.OrdersCaptureRequest(token);
    try {
      const captureResponse = await this.client.execute(request);
      return captureResponse.result;
    } catch (error) {
      throw new Error(`Capture Order Failed: ${error.message}`);
    }
  }
}
