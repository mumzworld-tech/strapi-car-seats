// path: src/api/service-request/content-types/service-request/lifecycles.js

module.exports = {
  async beforeUpdate(event) {
    const { params } = event;

    const { paymentStatus } = params.data;

    // Get current entry before update
    const currentOrder = await strapi.entityService.findOne(
      "api::order.order",
      params.where.id,
      {
        populate: {
          customer: true,
          location: true,
          package: true,
        },
      }
    );

    const {
      orderId,
      paymentStatus: paymentStatusOld,
      customer,
      documentId,
      locales = "en",
    } = currentOrder;

    // Only send email if payment status changes to pending
    if (
      paymentStatus === paymentStatusOld ||
      paymentStatus !== "Payment confirmed"
    ) {
      return;
    }

    const finalDocumentId = documentId || orderId?.toUpperCase();
    const baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    const downloadLink = `${baseUrl}/download-invoice/download/${finalDocumentId}`;

    const body = {
      ar: {
        subject: `تم تأكيد طلب خدمتك في ممز وورلد 🎉`,
        text: `
          ،${customer.fullName} أهلًا

          .شكرًا لاختيارك خدمات الأمهات على ممزورلد

          .يسعدنا إبلاغك بأن طلب الخدمة رقم #${finalDocumentId} قد تم تأكيده بنجاح

          .يمكنك تحميل فاتورتك من هنا: ${downloadLink}

          .سيتواصل معكِ فريقنا قريبًا لشرح الخطوات التالية والتأكد من أن كل شيء يسير بكل سهولة

          .نحن معكِ في كل خطوة، ونتطلع لأن نجعل هذه التجربة أيسر وأجمل لكِ

          ،من القلب
          فريق ممزورلد
        `.trim(),
        html: `
          <html lang="ar" dir="rtl">
            <body style="text-align: right;">
              ،${customer.fullName} أهلًا<br/><br/>

              .شكرًا لاختيارك خدمات الأمهات على ممزورلد<br/><br/>

              .يسعدنا إبلاغك بأن طلب الخدمة رقم #${finalDocumentId} قد تم تأكيده بنجاح<br/><br/>

              <a href="${downloadLink}">تحميل الفاتورة</a><br/><br/>

              .سيتواصل معكِ فريقنا قريبًا لشرح الخطوات التالية والتأكد من أن كل شيء يسير بكل سهولة<br/><br/>

              .نحن معكِ في كل خطوة، ونتطلع لأن نجعل هذه التجربة أيسر وأجمل لكِ<br/><br/>

              ،من القلب<br/>
              فريق ممزورلد
            </body>
          </html>
        `,
      },
      en: {
        subject: `Your Mumzworld Service Order is Confirmed 🎉`,
        text: `
            Dear ${customer.fullName},\n\n

            Thank you for booking your service with Mumzworld.

            We're happy to let you know that your service order #${finalDocumentId} has been successfully confirmed.

            Please find attached the invoice for your order, or download it here: ${downloadLink}

            We'll be in touch shortly to guide you through the next steps and make sure everything goes smoothly.

            We're here to support you and can't wait to make this part of your journey a little easier.

            Warmly,
            The Mumzworld Team
          `.trim(),
        html: `
          <html>
            <body>
              Dear ${customer.fullName},<br/><br/>

              Thank you for booking your service with Mumzworld.<br/><br/>

              We're happy to let you know that your service order #${finalDocumentId} has been successfully confirmed.<br/><br/>

              <a href="${downloadLink}">Download Invoice</a><br/><br/>

              We'll be in touch shortly to guide you through the next steps and make sure everything goes smoothly.<br/><br/>

              We're here to support you and can't wait to make this part of your journey a little easier.<br/><br/>

              Warmly,<br/>
              The Mumzworld Team
            </body>
          </html>
          `,
      },
    };

    const internalEmailBody = {
      en: {
        subject: `New booking alert - Car Seat Cleaning`,
        text: `
            Hello Team,
            A new booking has been successfully received and requires processing.

            Booking Details:

            Booking ID: ${orderId}

            Service: Car Seat Cleaning

            Customer Details:

            Customer Name: ${customer.fullName}

            Customer Email: ${customer.email}

            Customer Phone: ${customer.Phone}

            Please review and take the necessary next steps.

            Thank you,

            Mumzworld
          `.trim(),
        html: `
          <html>
            <body>
              Hello Team,<br/><br/>
              A new booking has been successfully received and requires processing.<br/><br/>

              <b>Booking Details:</b>
              <ul>
                <li>
                <b>Booking ID:</b> ${orderId}
                </li>
                <li>
                <b>Service:</b> Car Seat Cleaning
                </li>
              </ul>

              <b>Customer Details:</b>

              <ul>
                <li>
                  <b>Customer Name:</b> ${customer.fullName}
                </li>
                <li>
                  <b>Customer Email:</b> ${customer.email}
                </li>
                <li>
                  <b>Customer Phone:</b> ${customer.countryCode}${customer.phone}
                </li>
              </ul>

              Please review and take the necessary next steps.<br/><br/>

              Thank you,<br/>
              Mumzworld
            </body>
          </html>
          `,
      },
    };

    try {
      // Generate invoice PDF for attachment
      const pdfGenerator = strapi.plugin("download-invoice").service("pdfGenerator");
      const orderData = pdfGenerator.prepareOrderData(currentOrder);
      const pdfPath = await pdfGenerator.generateInvoice(orderData, orderId);

      // Read PDF file for attachment
      const fs = require("fs").promises;
      const pdfBuffer = await fs.readFile(pdfPath);

      const attachments = [{
        filename: `invoice-${finalDocumentId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }];

      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: customer.email,
          attachments,
          ...body[locales || "en"],
        });
      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: "services@mumzworld.com",
          attachments,
          ...internalEmailBody["en"],
        });
    } catch (error) {
      console.error("Error sending confirmation emails:", error);
    }
  },
};
